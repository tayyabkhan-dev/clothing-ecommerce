
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  // Product ki image mukhtalif supported fields se lena
  const imageUrl =
    (Array.isArray(product.images) &&
      product.images.length > 0 &&
      product.images[0]) ||
    product.image ||
    product.imageUrl ||
    "";

  return (
    <article className="product-card">
      <Link to={`/products/${product.id || product._id}`}>
        <div className="product-image">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name || "Product"}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span>Image Coming Soon</span>
          )}
        </div>

        <div className="product-info">
          <p className="product-category">
            {product.category}
          </p>

          <h2>{product.name}</h2>

          <strong>
            Rs. {Number(product.price).toLocaleString("en-PK")}
          </strong>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
