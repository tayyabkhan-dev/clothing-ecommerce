
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

function normalizeOption(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function findMatchingVariant(variants, selectedSize, selectedColor) {
  const normalizedSize = normalizeOption(selectedSize);
  const normalizedColor = normalizeOption(selectedColor);

  return variants.find((variant) => {
    const variantSize = normalizeOption(variant.size);
    const variantColor = normalizeOption(variant.color);

    return (
      variantSize === normalizedSize &&
      variantColor === normalizedColor
    );
  });
}

// Create a new order
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { customer, items, paymentMethod } = req.body;

    if (
      !customer ||
      !customer.name ||
      !customer.phone ||
      !customer.email ||
      !customer.address ||
      !customer.city ||
      !customer.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete customer information is required.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product.",
      });
    }

    if (paymentMethod !== "cod") {
      return res.status(400).json({
        success: false,
        message: "Only Cash on Delivery is currently supported.",
      });
    }

    const orderItems = [];
    let subtotal = 0;

    session.startTransaction();

    for (const item of items) {
      if (!item.product) {
        throw new Error("Product ID is required for every order item.");
      }

      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        throw new Error("Invalid product ID.");
      }

      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new Error("Invalid product quantity.");
      }

      const product = await Product.findOne({
        _id: item.product,
        isActive: true,
      }).session(session);

      if (!product) {
        throw new Error(
          "One or more products are no longer available."
        );
      }

      const selectedSize = String(item.size || "").trim();
      const selectedColor = String(item.color || "").trim();

      // Validate selected size
      if (
        selectedSize &&
        product.sizes.length > 0 &&
        !product.sizes.some(
          (productSize) =>
            normalizeOption(productSize) ===
            normalizeOption(selectedSize)
        )
      ) {
        throw new Error(
          `Selected size is not available for ${product.name}.`
        );
      }

      // Validate selected color
      if (
        selectedColor &&
        product.colors.length > 0 &&
        !product.colors.some(
          (productColor) =>
            normalizeOption(productColor) ===
            normalizeOption(selectedColor)
        )
      ) {
        throw new Error(
          `Selected color is not available for ${product.name}.`
        );
      }

      // Handle products with size/color variants
      if (
        Array.isArray(product.variants) &&
        product.variants.length > 0
      ) {
        const matchingVariant = findMatchingVariant(
          product.variants,
          selectedSize,
          selectedColor
        );

        if (!matchingVariant) {
          throw new Error(
            `Selected size/color combination is not available for ${product.name}.`
          );
        }

        // Atomically deduct stock from the selected variant
        const stockUpdate = await Product.updateOne(
          {
            _id: product._id,
            isActive: true,
            variants: {
              $elemMatch: {
                _id: matchingVariant._id,
                stock: {
                  $gte: item.quantity,
                },
              },
            },
          },
          {
            $inc: {
              "variants.$.stock": -item.quantity,
              stock: -item.quantity,
            },
          },
          {
            session,
          }
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw new Error(
            `${product.name} does not have enough stock for the selected size/color.`
          );
        }
      } else {
        // Handle products without variants
        const stockUpdate = await Product.updateOne(
          {
            _id: product._id,
            isActive: true,
            stock: {
              $gte: item.quantity,
            },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          {
            session,
          }
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw new Error(
            `${product.name} does not have enough stock available.`
          );
        }
      }

      // Always use the database price
      const itemTotal = product.price * item.quantity;

      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        color: selectedColor,
        quantity: item.quantity,
        itemTotal,
      });
    }

    // Shipping and discounts are not implemented yet
    const shipping = 0;
    const discount = 0;
    const grandTotal = subtotal + shipping - discount;

    // Generate order number
    const orderNumber =
      `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Save the order and its initial tracking history
    const [order] = await Order.create(
      [
        {
          orderNumber,

          // Registered customers are linked to their account.
          // Guest orders have no associated user.
          user: req.user?.userId || null,

          customer: {
            name: customer.name.trim(),
            phone: customer.phone.trim(),
            email: customer.email.trim().toLowerCase(),
            address: customer.address.trim(),
            city: customer.city.trim(),
            postalCode: customer.postalCode.trim(),
          },

          items: orderItems,

          pricing: {
            subtotal,
            shipping,
            discount,
            grandTotal,
          },

          paymentMethod: "cod",
          paymentStatus: "pending",
          orderStatus: "pending",

          statusHistory: [
            {
              status: "pending",
              note: "Order placed",
            },
          ],
        },
      ],
      {
        session,
      }
    );

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        customer: order.customer,
        items: order.items,
        pricing: order.pricing,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        statusHistory: order.statusHistory,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Create order error:", error.message);

    const clientErrors = [
      "Product ID",
      "Invalid product",
      "available",
      "stock",
      "size/color",
      "quantity",
    ];

    const isClientError = clientErrors.some((keyword) =>
      error.message.includes(keyword)
    );

    return res.status(isClientError ? 400 : 500).json({
      success: false,
      message: isClientError
        ? error.message
        : "Failed to create order.",
    });
  } finally {
    await session.endSession();
  }
};

// Get all orders (admin route; authorization is handled by middleware)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

// Get one order by ID (admin route; authorization is handled by middleware)
const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(req.params.id).lean();

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
    console.error("Get order by ID error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
    });
  }
};

// Update order status and append to tracking history

const updateOrderStatus = async (req, res) => {
  // Validate request before starting a database transaction.
  const { status, note } = req.body;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID.",
    });
  }

  if (
    note !== undefined &&
    (typeof note !== "string" || note.trim().length > 300)
  ) {
    return res.status(400).json({
      success: false,
      message: "Note must be text with a maximum of 300 characters.",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      const error = new Error("Order not found.");
      error.statusCode = 404;
      throw error;
    }

    if (order.orderStatus === status) {
      await session.abortTransaction();

      return res.status(200).json({
        success: true,
        message: "Order already has this status.",
        order,
      });
    }

    // A cancelled order must not be reopened through this endpoint.
    if (order.orderStatus === "cancelled") {
      const error = new Error(
        "A cancelled order cannot be updated."
      );
      error.statusCode = 409;
      throw error;
    }

    // Restore inventory only when cancelling an eligible order.
    if (status === "cancelled") {
      if (!["pending", "confirmed"].includes(order.orderStatus)) {
        const error = new Error(
          "Only pending or confirmed orders can be cancelled."
        );
        error.statusCode = 409;
        throw error;
      }

      for (const item of order.items) {
        const product = await Product.findById(item.product)
          .session(session);

        if (!product) {
          const error = new Error(
            `Product "${item.name}" was not found. Cancellation was not completed.`
          );
          error.statusCode = 409;
          throw error;
        }

        if (
          Array.isArray(product.variants) &&
          product.variants.length > 0
        ) {
          const matchingVariant = findMatchingVariant(
            product.variants,
            item.size,
            item.color
          );

          if (!matchingVariant) {
            const error = new Error(
              `The original size/color variant for "${item.name}" was not found. Cancellation was not completed.`
            );
            error.statusCode = 409;
            throw error;
          }

          const stockUpdate = await Product.updateOne(
            {
              _id: product._id,
              variants: {
                $elemMatch: { _id: matchingVariant._id },
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
            throw new Error(
              `Could not restore stock for "${item.name}".`
            );
          }
        } else {
          const stockUpdate = await Product.updateOne(
            { _id: product._id },
            { $inc: { stock: item.quantity } },
            { session }
          );

          if (stockUpdate.modifiedCount !== 1) {
            throw new Error(
              `Could not restore stock for "${item.name}".`
            );
          }
        }
      }
    }

    order.orderStatus = status;

    order.statusHistory.push({
      status,
      changedBy: req.user?.userId || null,
      note: note?.trim() || `Order status changed to ${status}.`,
      changedAt: new Date(),
    });

    await order.save({ session });
    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Update order status error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : "Failed to update order status. No changes were committed.",
    });
  } finally {
    await session.endSession();
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
