import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { getProductById } from "../services/productService";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [size, setSize] =
    useState("");

  const [color, setColor] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const fetchedProduct =
          await getProductById(id);

        if (isMounted) {
          setProduct(fetchedProduct);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.message ||
              "Failed to load product."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  /*
    Find the selected variant.

    We normalize spaces and capitalization so:
    "Small" and " small " are treated consistently.
  */
  const selectedVariant = useMemo(() => {
    if (
      !product ||
      !Array.isArray(product.variants) ||
      product.variants.length === 0
    ) {
      return null;
    }

    const normalizedSize =
      size.trim().toLowerCase();

    const normalizedColor =
      color.trim().toLowerCase();

    return (
      product.variants.find(
        (variant) => {
          const variantSize =
            (variant.size || "")
              .trim()
              .toLowerCase();

          const variantColor =
            (variant.color || "")
              .trim()
              .toLowerCase();

          return (
            variantSize === normalizedSize &&
            variantColor === normalizedColor
          );
        }
      ) || null
    );
  }, [product, size, color]);

  /*
    If variants exist, use selected variant stock.

    Otherwise use the product's main stock.
  */
  const availableStock =
    product?.variants?.length > 0
      ? selectedVariant?.stock ?? 0
      : product?.stock ?? 0;

  const handleQuantityChange = (
    event
  ) => {
    const newQuantity = Number(
      event.target.value
    );

    setMessage("");

    if (
      !Number.isInteger(newQuantity)
    ) {
      setQuantity(1);
      return;
    }

    if (newQuantity < 1) {
      setQuantity(1);
      return;
    }

    if (
      newQuantity > availableStock
    ) {
      setQuantity(availableStock);

      setMessage(
        `Only ${availableStock} items are currently available for this variant.`
      );

      setMessageType("error");

      return;
    }

    setQuantity(newQuantity);
  };

  const decreaseQuantity = () => {
    setMessage("");

    setQuantity((currentQuantity) =>
      Math.max(
        1,
        currentQuantity - 1
      )
    );
  };

  const increaseQuantity = () => {
    setMessage("");

    setQuantity(
      (currentQuantity) => {
        if (
          currentQuantity >=
          availableStock
        ) {
          setMessage(
            `Only ${availableStock} items are currently available for this variant.`
          );

          setMessageType("error");

          return currentQuantity;
        }

        return currentQuantity + 1;
      }
    );
  };

  const handleAddToCart = () => {
    setMessage("");

    /*
      Require size when product has sizes.
    */
    if (
      product?.sizes?.length > 0 &&
      !size
    ) {
      setMessage(
        "Please select a size."
      );

      setMessageType("error");

      return;
    }

    /*
      Require color when product has colors.
    */
    if (
      product?.colors?.length > 0 &&
      !color
    ) {
      setMessage(
        "Please select a color."
      );

      setMessageType("error");

      return;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      setMessage(
        "Please select a valid quantity."
      );

      setMessageType("error");

      return;
    }

    /*
      When variants exist, make sure the
      selected size/color combination exists.
    */
    if (
      product?.variants?.length > 0 &&
      !selectedVariant
    ) {
      setMessage(
        "This size and color combination is not available."
      );

      setMessageType("error");

      return;
    }

    /*
      Validate selected stock.
    */
    if (
      quantity > availableStock
    ) {
      setMessage(
        `Only ${availableStock} items are currently available.`
      );

      setMessageType("error");

      return;
    }

    if (availableStock <= 0) {
      setMessage(
        "This selected variant is out of stock."
      );

      setMessageType("error");

      return;
    }

    const cartProduct = {
      id: product._id,

      name: product.name,

      category: product.category,

      price: product.price,

      size,

      color,

      quantity,

      /*
        Save the currently available stock
        for frontend cart information.
      */
      availableStock,
    };

    addToCart(cartProduct);

    setMessage(
      "Product added to cart successfully."
    );

    setMessageType("success");
  };

  if (loading) {
    return (
      <main>
        <section className="product-details">
          <div>
            <h1>
              Loading Product...
            </h1>

            <p>
              Please wait while we load the product.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main>
        <section className="product-details">
          <div>
            <h1>
              Product Not Found
            </h1>

            <p>
              {error ||
                "The product you are looking for does not exist."}
            </p>

            <Link to="/products">
              Back to Products
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="product-details">
        <div className="product-details-image">
          {product.images &&
          product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
            />
          ) : (
            <span>
              Product Image
            </span>
          )}
        </div>

        <div className="product-details-info">
          <p className="product-details-category">
            {product.category.toUpperCase()}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-price">
            Rs. {product.price}
          </p>

          <p className="product-details-description">
            {product.description}
          </p>

          <p className="product-stock">
            {availableStock > 0
              ? `${availableStock} items available`
              : "Out of stock"}
          </p>

          {product.sizes?.length > 0 && (
            <div className="product-option">
              <label htmlFor="size">
                Select Size
              </label>

              <select
                id="size"
                value={size}
                onChange={(event) => {
                  setSize(
                    event.target.value
                  );

                  setQuantity(1);

                  setMessage("");
                }}
              >
                <option value="">
                  Choose a size
                </option>

                {product.sizes.map(
                  (productSize) => (
                    <option
                      key={productSize}
                      value={productSize}
                    >
                      {productSize.toUpperCase()}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="product-option">
              <label htmlFor="color">
                Select Color
              </label>

              <select
                id="color"
                value={color}
                onChange={(event) => {
                  setColor(
                    event.target.value
                  );

                  setQuantity(1);

                  setMessage("");
                }}
              >
                <option value="">
                  Choose a color
                </option>

                {product.colors.map(
                  (productColor) => (
                    <option
                      key={productColor}
                      value={productColor}
                    >
                      {productColor.toUpperCase()}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {product.variants?.length >
            0 &&
            size &&
            color &&
            !selectedVariant && (
              <p className="product-message error">
                This size and color combination
                is not available.
              </p>
            )}

          {selectedVariant && (
            <p className="product-stock">
              Selected variant stock:{" "}
              {selectedVariant.stock}
            </p>
          )}

          <div className="product-option">
            <label htmlFor="quantity">
              Quantity
            </label>

            <div className="product-quantity">
              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1
                }
                aria-label="Decrease quantity"
              >
                -
              </button>

              <input
                id="quantity"
                type="number"
                min="1"
                max={availableStock}
                value={quantity}
                onChange={
                  handleQuantityChange
                }
              />

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  quantity >=
                  availableStock
                }
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {message && (
            <p
              className={`product-message ${messageType}`}
            >
              {message}
            </p>
          )}

          <button
            className="add-to-cart-button"
            onClick={
              handleAddToCart
            }
            disabled={
              availableStock === 0
            }
          >
            {availableStock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;