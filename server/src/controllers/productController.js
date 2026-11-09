const mongoose = require("mongoose");

const Product = require("../models/Product");

// Get all active products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
};

// Get one active product by ID
const getProductById = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get product by ID error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch product.",
    });
  }
};

// Validate product data
function validateProductData(data) {
  const {
    name,
    description,
    category,
    price,
    images,
    sizes,
    colors,
    variants,
    stock,
    isActive,
  } = data;

  if (
    typeof name !== "string" ||
    !name.trim()
  ) {
    return "Product name is required.";
  }

  if (
    typeof description !== "string" ||
    !description.trim()
  ) {
    return "Product description is required.";
  }

  if (
    typeof category !== "string" ||
    !category.trim()
  ) {
    return "Product category is required.";
  }

  if (
    price === undefined ||
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    return "Price must be a valid non-negative number.";
  }

  if (
    images !== undefined &&
    !Array.isArray(images)
  ) {
    return "Images must be an array.";
  }

  if (
    sizes !== undefined &&
    !Array.isArray(sizes)
  ) {
    return "Sizes must be an array.";
  }

  if (
    colors !== undefined &&
    !Array.isArray(colors)
  ) {
    return "Colors must be an array.";
  }

  if (
    variants !== undefined &&
    !Array.isArray(variants)
  ) {
    return "Variants must be an array.";
  }

  if (
    stock !== undefined &&
    (
      typeof stock !== "number" ||
      !Number.isInteger(stock) ||
      stock < 0
    )
  ) {
    return "Stock must be a non-negative integer.";
  }

  if (
    isActive !== undefined &&
    typeof isActive !== "boolean"
  ) {
    return "isActive must be true or false.";
  }

  if (Array.isArray(variants)) {
    for (const variant of variants) {
      if (
        !variant ||
        typeof variant !== "object"
      ) {
        return "Each variant must be an object.";
      }

      if (
        variant.size !== undefined &&
        typeof variant.size !== "string"
      ) {
        return "Variant size must be text.";
      }

      if (
        variant.color !== undefined &&
        typeof variant.color !== "string"
      ) {
        return "Variant color must be text.";
      }

      if (
        typeof variant.stock !== "number" ||
        !Number.isInteger(variant.stock) ||
        variant.stock < 0
      ) {
        return "Variant stock must be a non-negative integer.";
      }
    }
  }

  return null;
}

// Create a new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      images = [],
      sizes = [],
      colors = [],
      variants = [],
      stock,
      isActive = true,
    } = req.body;

    const validationError =
      validateProductData({
        name,
        description,
        category,
        price,
        images,
        sizes,
        colors,
        variants,
        stock,
        isActive,
      });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const calculatedVariantStock =
      variants.length > 0
        ? variants.reduce(
            (total, variant) =>
              total + variant.stock,
            0
          )
        : null;

    const finalStock =
      calculatedVariantStock !== null
        ? calculatedVariantStock
        : stock ?? 0;

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price,
      images,
      sizes,
      colors,
      variants,
      stock: finalStock,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error(
      "Create product error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create product.",
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const {
      name,
      description,
      category,
      price,
      images,
      sizes,
      colors,
      variants,
      stock,
      isActive,
    } = req.body;

    const validationError =
      validateProductData({
        name,
        description,
        category,
        price,
        images,
        sizes,
        colors,
        variants,
        stock,
        isActive,
      });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const updateData = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price,
      images,
      sizes,
      colors,
      variants,
      isActive,
    };

    if (variants.length > 0) {
      updateData.stock = variants.reduce(
        (total, variant) =>
          total + variant.stock,
        0
      );
    } else {
      updateData.stock = stock ?? 0;
    }

    const product =
      await Product.findByIdAndUpdate(
        productId,
        updateData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to update product.",
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product =
      await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete product.",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};