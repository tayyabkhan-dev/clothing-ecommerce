const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  adminOnly,
} = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC CUSTOMER ROUTES
// ==========================================

// Get all active products
router.get(
  "/",
  getProducts
);

// Get one active product
router.get(
  "/:id",
  getProductById
);

// ==========================================
// ADMIN-ONLY ROUTES
// ==========================================

// Create a new product
router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);

// Update a product
router.patch(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

// Delete a product
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

module.exports = router;