
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

function normalizeOption(value) {
  return String(value || "").trim().toLowerCase();
}

function findMatchingVariant(variants, size, color) {
  return variants.find(
    (variant) =>
      normalizeOption(variant.size) === normalizeOption(size) &&
      normalizeOption(variant.color) === normalizeOption(color)
  );
}

// Get orders belonging to the currently logged-in customer.
const getMyOrders = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const orders = await Order.find({
      user: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .select(
        "orderNumber items pricing paymentMethod paymentStatus orderStatus createdAt"
      )
      .lean();

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your orders.",
    });
  }
};

// Get one order belonging to the currently logged-in customer.
const getMyOrderById = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get my order by ID error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your order.",
    });
  }
};

// Cancel an order belonging to the currently logged-in customer.
const cancelMyOrder = async (req, res) => {
  if (!req.user?.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID.",
    });
  }

  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Find only this customer's order.
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    }).session(session);

    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Only pending and confirmed orders can be cancelled.
    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      await session.abortTransaction();

      return res.status(409).json({
        success: false,
        message: `This order cannot be cancelled because its status is "${order.orderStatus}".`,
      });
    }

    // Restore stock for every item in the order.
    for (const item of order.items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new Error(
          `Product "${item.name}" no longer exists. Stock restoration requires review.`
        );
      }

      if (Array.isArray(product.variants) && product.variants.length > 0) {
        const matchingVariant = findMatchingVariant(
          product.variants,
          item.size,
          item.color
        );

        if (!matchingVariant) {
          throw new Error(
            `The original size/color variant for "${item.name}" no longer exists. Stock restoration requires review.`
          );
        }

        const stockUpdate = await Product.updateOne(
          {
            _id: product._id,
            variants: {
              $elemMatch: {
                _id: matchingVariant._id,
              },
            },
          },
          {
            $inc: {
              "variants.$.stock": item.quantity,
              stock: item.quantity,
            },
          },
          { session }
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw new Error(`Failed to restore stock for "${item.name}".`);
        }
      } else {
        // Products without variants use their main stock field.
        const stockUpdate = await Product.updateOne(
          { _id: product._id },
          { $inc: { stock: item.quantity } },
          { session }
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw new Error(`Failed to restore stock for "${item.name}".`);
        }
      }
    }

    // Update status only if it is still cancellable.
    // This prevents duplicate stock restoration if another request
    // changes the order status concurrently.
    const statusUpdate = await Order.updateOne(
      {
        _id: order._id,
        user: req.user.userId,
        orderStatus: { $in: ["pending", "confirmed"] },
      },
      {
        $set: { orderStatus: "cancelled" },
        $push: {
          statusHistory: {
            status: "cancelled",
            changedAt: new Date(),
            changedBy: req.user.userId,
            note: "Order cancelled by customer.",
          },
        },
      },
      { session }
    );

    if (statusUpdate.modifiedCount !== 1) {
      const conflictError = new Error(
        "The order status changed before cancellation could finish."
      );
      conflictError.statusCode = 409;
      throw conflictError;
    }

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully. Stock has been restored.",
    });
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Cancel customer order error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode === 409
          ? error.message
          : "Order cancellation failed. No changes were committed. Please contact support if the problem continues.",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

module.exports = {
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
};
