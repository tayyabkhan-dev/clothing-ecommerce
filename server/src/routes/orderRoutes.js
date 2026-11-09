
const express = require("express");

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
} = require("../controllers/customerOrderController");

const {
  optionalAuth,
} = require("../middleware/optionalAuthMiddleware");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  adminOnly,
} = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// CUSTOMER ORDER ROUTES
// ==========================================

// Get orders belonging to the currently logged-in customer.
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// Get one order belonging to the currently logged-in customer.
router.get(
  "/my-orders/:id",
  protect,
  getMyOrderById
);

// Cancel an order belonging to the currently logged-in customer.
router.patch(
  "/my-orders/:id/cancel",
  protect,
  cancelMyOrder
);

// Create a new order.
// Login is optional:
// - Logged-in customer -> order linked to user
// - Guest customer -> user remains null
router.post(
  "/",
  optionalAuth,
  createOrder
);

// ==========================================
// ADMIN-ONLY ORDER ROUTES
// ==========================================

// Get all orders.
router.get(
  "/",
  protect,
  adminOnly,
  getOrders
);

// Update order status.
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

// Get one order by ID.
router.get(
  "/:id",
  protect,
  adminOnly,
  getOrderById
);

module.exports = router;
