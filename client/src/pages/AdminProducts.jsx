import { useEffect, useState } from "react";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productService";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  sizes: "",
  colors: "",
  images: "",
  variants: [],
  stock: "0",
  isActive: true,
};

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    ...emptyForm,
    variants: [],
  });

  const [editingProductId, setEditingProductId] =
    useState(null);

  const [variantSize, setVariantSize] =
    useState("");

  const [variantColor, setVariantColor] =
    useState("");

  const [variantStock, setVariantStock] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getProducts();

      setProducts(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Load admin products error:",
        error
      );

      setError(
        error.message ||
          "Failed to load products."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function resetVariantInputs() {
    setVariantSize("");
    setVariantColor("");
    setVariantStock("");
  }

  function resetForm() {
    setForm({
      ...emptyForm,
      variants: [],
    });

    setEditingProductId(null);

    resetVariantInputs();

    setError("");
  }

  function addVariant() {
    setError("");
    setSuccess("");

    const size =
      variantSize.trim();

    const color =
      variantColor.trim();

    if (!size && !color) {
      setError(
        "Enter a size or color for the variant."
      );

      return;
    }

    if (
      variantStock.trim() === ""
    ) {
      setError(
        "Enter stock for the variant."
      );

      return;
    }

    const stockNumber =
      Number(variantStock);

    if (
      !Number.isInteger(
        stockNumber
      ) ||
      stockNumber < 0
    ) {
      setError(
        "Variant stock must be a non-negative whole number."
      );

      return;
    }

    const normalizedSize =
      size.toLowerCase();

    const normalizedColor =
      color.toLowerCase();

    const duplicateVariant =
      form.variants.some(
        (variant) => {
          const existingSize =
            String(
              variant.size || ""
            )
              .trim()
              .toLowerCase();

          const existingColor =
            String(
              variant.color || ""
            )
              .trim()
              .toLowerCase();

          return (
            existingSize ===
              normalizedSize &&
            existingColor ===
              normalizedColor
          );
        }
      );

    if (duplicateVariant) {
      setError(
        "This size/color combination already exists."
      );

      return;
    }

    const newVariant = {
      size,
      color,
      stock: stockNumber,
    };

    setForm((currentForm) => ({
      ...currentForm,

      variants: [
        ...currentForm.variants,
        newVariant,
      ],
    }));

    resetVariantInputs();
  }

  function removeVariant(index) {
    setError("");
    setSuccess("");

    setForm((currentForm) => ({
      ...currentForm,

      variants:
        currentForm.variants.filter(
          (_, variantIndex) =>
            variantIndex !== index
        ),
    }));
  }

  function updateVariantStock(
    index,
    value
  ) {
    setForm((currentForm) => ({
      ...currentForm,

      variants:
        currentForm.variants.map(
          (variant, variantIndex) =>
            variantIndex === index
              ? {
                  ...variant,
                  stock: value,
                }
              : variant
        ),
    }));
  }

  function getVariantOptions() {
    const sizeMap =
      new Map();

    const colorMap =
      new Map();

    form.variants.forEach(
      (variant) => {
        const size =
          String(
            variant.size || ""
          ).trim();

        const color =
          String(
            variant.color || ""
          ).trim();

        if (size) {
          const key =
            size.toLowerCase();

          if (!sizeMap.has(key)) {
            sizeMap.set(
              key,
              size
            );
          }
        }

        if (color) {
          const key =
            color.toLowerCase();

          if (
            !colorMap.has(key)
          ) {
            colorMap.set(
              key,
              color
            );
          }
        }
      }
    );

    return {
      sizes:
        Array.from(
          sizeMap.values()
        ),

      colors:
        Array.from(
          colorMap.values()
        ),
    };
  }

  function startEditing(product) {
    setEditingProductId(
      product._id
    );

    const existingVariants =
      Array.isArray(
        product.variants
      )
        ? product.variants.map(
            (variant) => ({
              _id: variant._id,

              size:
                variant.size || "",

              color:
                variant.color || "",

              stock:
                Number.isInteger(
                  variant.stock
                )
                  ? variant.stock
                  : 0,
            })
          )
        : [];

    setForm({
      name:
        product.name || "",

      description:
        product.description || "",

      category:
        product.category || "",

      price:
        product.price !==
        undefined
          ? String(
              product.price
            )
          : "",

      sizes:
        Array.isArray(
          product.sizes
        )
          ? product.sizes.join(
              ", "
            )
          : "",

      colors:
        Array.isArray(
          product.colors
        )
          ? product.colors.join(
              ", "
            )
          : "",

      images:
        Array.isArray(
          product.images
        )
          ? product.images.join(
              ", "
            )
          : "",

      variants:
        existingVariants,

      stock:
        product.stock !==
        undefined
          ? String(
              product.stock
            )
          : "0",

      isActive:
        product.isActive !==
        false,
    });

    resetVariantInputs();

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function validateVariants() {
    const seen =
      new Set();

    for (
      let index = 0;
      index <
      form.variants.length;
      index += 1
    ) {
      const variant =
        form.variants[index];

      const size =
        String(
          variant.size || ""
        )
          .trim()
          .toLowerCase();

      const color =
        String(
          variant.color || ""
        )
          .trim()
          .toLowerCase();

      const stock =
        Number(
          variant.stock
        );

      if (!size && !color) {
        return `Variant ${
          index + 1
        } must have a size or color.`;
      }

      if (
        !Number.isInteger(
          stock
        ) ||
        stock < 0
      ) {
        return `Variant ${
          index + 1
        } stock must be a non-negative whole number.`;
      }

      const key =
        `${size}__${color}`;

      if (
        seen.has(key)
      ) {
        return `Duplicate variant found: ${
          variant.size ||
          "No size"
        } / ${
          variant.color ||
          "No color"
        }.`;
      }

      seen.add(key);
    }

    return null;
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (isSaving) {
      return;
    }

    const name =
      form.name.trim();

    const description =
      form.description.trim();

    const category =
      form.category.trim();

    const priceNumber =
      Number(form.price);

    const stockNumber =
      Number(form.stock);

    if (!name) {
      setError(
        "Product name is required."
      );

      return;
    }

    if (!description) {
      setError(
        "Product description is required."
      );

      return;
    }

    if (!category) {
      setError(
        "Product category is required."
      );

      return;
    }

    if (
      !Number.isFinite(
        priceNumber
      ) ||
      priceNumber < 0
    ) {
      setError(
        "Price must be a valid non-negative number."
      );

      return;
    }

    if (
      !Number.isInteger(
        stockNumber
      ) ||
      stockNumber < 0
    ) {
      setError(
        "Base stock must be a non-negative whole number."
      );

      return;
    }

    const variantValidationError =
      validateVariants();

    if (
      variantValidationError
    ) {
      setError(
        variantValidationError
      );

      return;
    }

    /*
      IMPORTANT:

      When variants exist, sizes and colors
      are generated automatically from variants.

      This prevents data such as:

      sizes: small
      colors: blue
      variant: M / black

      from being saved.
    */

    const variantOptions =
      getVariantOptions();

    const finalSizes =
      form.variants.length >
      0
        ? variantOptions.sizes
        : form.sizes
            .split(",")
            .map(
              (size) =>
                size.trim()
            )
            .filter(Boolean);

    const finalColors =
      form.variants.length >
      0
        ? variantOptions.colors
        : form.colors
            .split(",")
            .map(
              (color) =>
                color.trim()
            )
            .filter(Boolean);

    const productData = {
      name,

      description,

      category,

      price:
        priceNumber,

      images:
        form.images
          .split(",")
          .map(
            (image) =>
              image.trim()
          )
          .filter(Boolean),

      sizes:
        finalSizes,

      colors:
        finalColors,

      variants:
        form.variants.map(
          (variant) => ({
            ...(variant._id
              ? {
                  _id:
                    variant._id,
                }
              : {}),

            size:
              String(
                variant.size ||
                  ""
              ).trim(),

            color:
              String(
                variant.color ||
                  ""
              ).trim(),

            stock:
              Number(
                variant.stock
              ),
          })
        ),

      stock:
        form.variants.length >
        0
          ? form.variants.reduce(
              (
                total,
                variant
              ) =>
                total +
                Number(
                  variant.stock
                ),
              0
            )
          : stockNumber,

      isActive:
        form.isActive,
    };

    setIsSaving(true);

    try {
      if (
        editingProductId
      ) {
        await updateProduct(
          editingProductId,
          productData
        );

        setSuccess(
          "Product updated successfully."
        );
      } else {
        await createProduct(
          productData
        );

        setSuccess(
          "Product created successfully."
        );
      }

      resetForm();

      await loadProducts();
    } catch (error) {
      console.error(
        "Save product error:",
        error
      );

      setError(
        error.message ||
          "Failed to save product."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(
    product
  ) {
    const shouldDelete =
      window.confirm(
        `Delete "${product.name}"? This action cannot be undone.`
      );

    if (!shouldDelete) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteProduct(
        product._id
      );

      setSuccess(
        "Product deleted successfully."
      );

      if (
        editingProductId ===
        product._id
      ) {
        resetForm();
      }

      await loadProducts();
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete product."
      );
    }
  }

  async function handleToggleActive(
    product
  ) {
    setError("");
    setSuccess("");

    try {
      await updateProduct(
        product._id,
        {
          name:
            product.name,

          description:
            product.description,

          category:
            product.category,

          price:
            product.price,

          images:
            product.images ||
            [],

          sizes:
            product.sizes ||
            [],

          colors:
            product.colors ||
            [],

          variants:
            product.variants ||
            [],

          stock:
            product.stock,

          isActive:
            !product.isActive,
        }
      );

      setSuccess(
        `Product ${
          product.isActive
            ? "deactivated"
            : "activated"
        } successfully.`
      );

      await loadProducts();
    } catch (error) {
      console.error(
        "Toggle product error:",
        error
      );

      setError(
        error.message ||
          "Failed to update product status."
      );
    }
  }

  if (isLoading) {
    return (
      <main>
        <section className="admin-products-page">
          <div className="admin-products-message">
            Loading products...
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="admin-products-page">
        <div className="admin-products-header">
          <p className="admin-products-label">
            ADMIN
          </p>

          <h1>
            {editingProductId
              ? "Edit Product"
              : "Product Management"}
          </h1>

          <p>
            Add, update and manage your
            store products.
          </p>
        </div>

        {error && (
          <div className="admin-products-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-products-success">
            {success}
          </div>
        )}

        <form
          className="admin-product-form"
          onSubmit={
            handleSubmit
          }
        >
          <h2>
            {editingProductId
              ? "Edit Product"
              : "Add Product"}
          </h2>

          <div className="admin-product-form-grid">
            <label>
              Product Name

              <input
                type="text"
                name="name"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
                placeholder="Classic Casual Shirt"
              />
            </label>

            <label>
              Category

              <input
                type="text"
                name="category"
                value={
                  form.category
                }
                onChange={
                  handleChange
                }
                placeholder="Men's Clothing"
              />
            </label>

            <label>
              Price

              <input
                type="number"
                name="price"
                value={
                  form.price
                }
                onChange={
                  handleChange
                }
                min="0"
                step="1"
                placeholder="4999"
              />
            </label>

            <label>
              Base Stock

              <input
                type="number"
                name="stock"
                value={
                  form.stock
                }
                onChange={
                  handleChange
                }
                min="0"
                step="1"
              />

              {form.variants
                .length > 0 && (
                <small>
                  With variants,
                  total stock is
                  calculated from
                  variant stock.
                </small>
              )}
            </label>

            <label>
              Sizes

              <input
                type="text"
                name="sizes"
                value={
                  form.sizes
                }
                onChange={
                  handleChange
                }
                placeholder="small, medium, large, xl"
                disabled={
                  form.variants
                    .length > 0
                }
              />

              {form.variants
                .length > 0 && (
                <small>
                  Automatically
                  generated from
                  variants.
                </small>
              )}
            </label>

            <label>
              Colors

              <input
                type="text"
                name="colors"
                value={
                  form.colors
                }
                onChange={
                  handleChange
                }
                placeholder="black, white, blue"
                disabled={
                  form.variants
                    .length > 0
                }
              />

              {form.variants
                .length > 0 && (
                <small>
                  Automatically
                  generated from
                  variants.
                </small>
              )}
            </label>

            <label>
              Image URLs

              <input
                type="text"
                name="images"
                value={
                  form.images
                }
                onChange={
                  handleChange
                }
                placeholder="https://example.com/shirt.jpg"
              />
            </label>

            <label className="admin-product-active-field">
              <span>
                Product Status
              </span>

              <input
                type="checkbox"
                name="isActive"
                checked={
                  form.isActive
                }
                onChange={
                  handleChange
                }
              />

              Active
            </label>
          </div>

          <label>
            Description

            <textarea
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              rows="5"
              placeholder="Describe the product..."
            />
          </label>

          <div className="admin-product-variants">
            <h3>
              Product Variants
            </h3>

            <p>
              Add a size/color
              combination with its
              own stock.
            </p>

            <div className="admin-product-variant-form">
              <input
                type="text"
                value={
                  variantSize
                }
                onChange={(
                  event
                ) =>
                  setVariantSize(
                    event.target
                      .value
                  )
                }
                placeholder="Size"
              />

              <input
                type="text"
                value={
                  variantColor
                }
                onChange={(
                  event
                ) =>
                  setVariantColor(
                    event.target
                      .value
                  )
                }
                placeholder="Color"
              />

              <input
                type="number"
                value={
                  variantStock
                }
                onChange={(
                  event
                ) =>
                  setVariantStock(
                    event.target
                      .value
                  )
                }
                min="0"
                step="1"
                placeholder="Stock"
              />

              <button
                type="button"
                onClick={
                  addVariant
                }
                disabled={
                  isSaving
                }
              >
                Add Variant
              </button>
            </div>

            {form.variants
              .length > 0 && (
              <div className="admin-product-variant-list">
                {form.variants.map(
                  (
                    variant,
                    index
                  ) => (
                    <div
                      className="admin-product-variant"
                      key={
                        variant._id ||
                        `${variant.size}-${variant.color}-${index}`
                      }
                    >
                      <div>
                        <span>
                          {variant.size ||
                            "No size"}{" "}
                          /{" "}
                          {variant.color ||
                            "No color"}
                        </span>

                        <strong>
                          Stock:{" "}
                          {
                            variant.stock
                          }
                        </strong>
                      </div>

                      <div>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={
                            variant.stock
                          }
                          onChange={(
                            event
                          ) =>
                            updateVariantStock(
                              index,
                              event
                                .target
                                .value
                            )
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeVariant(
                              index
                            )
                          }
                          disabled={
                            isSaving
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="admin-product-form-actions">
            <button
              type="submit"
              disabled={
                isSaving
              }
            >
              {isSaving
                ? "Saving..."
                : editingProductId
                ? "Update Product"
                : "Create Product"}
            </button>

            {editingProductId && (
              <button
                type="button"
                onClick={
                  resetForm
                }
                disabled={
                  isSaving
                }
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <section className="admin-product-list-section">
          <div className="admin-product-list-header">
            <h2>
              Products
            </h2>

            <strong>
              {products.length}
            </strong>
          </div>

          {products.length ===
          0 ? (
            <div className="admin-products-empty">
              <h3>
                No Products Found
              </h3>

              <p>
                Create your first
                product using the
                form above.
              </p>
            </div>
          ) : (
            <div className="admin-product-list">
              {products.map(
                (product) => (
                  <article
                    className="admin-product-card"
                    key={
                      product._id
                    }
                  >
                    <div>
                      <p>
                        {
                          product.category
                        }
                      </p>

                      <h3>
                        {
                          product.name
                        }
                      </h3>

                      <strong>
                        Rs.{" "}
                        {
                          product.price
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Stock:{" "}
                        {
                          product.stock
                        }
                      </span>

                      <span>
                        Variants:{" "}
                        {
                          product
                            .variants
                            ?.length ||
                          0
                        }
                      </span>

                      <span>
                        Status:{" "}
                        {product.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="admin-product-actions">
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(
                            product
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleActive(
                            product
                          )
                        }
                      >
                        {product.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            product
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default AdminProducts;