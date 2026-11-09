
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const fetchedProducts = await getProducts();

        if (isMounted) {
          setProducts(fetchedProducts);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.message || "Failed to load products."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(
        products.map((product) => product.category)
      ),
    ];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    const matchesCategory =
      !category || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort(
    (firstProduct, secondProduct) => {
      if (sortBy === "price-low") {
        return firstProduct.price - secondProduct.price;
      }

      if (sortBy === "price-high") {
        return secondProduct.price - firstProduct.price;
      }

      if (sortBy === "newest") {
        return (
          new Date(secondProduct.createdAt) -
          new Date(firstProduct.createdAt)
        );
      }

      return 0;
    }
  );

  return (
    <main>
      <section className="products-header">
        <p className="products-label">OUR COLLECTION</p>

        <h1>All Products</h1>

        <p>
          Explore our latest clothing collection.
        </p>
      </section>

      <section className="products-content">
        {loading && (
          <div className="products-loading">
            <p>Loading products...</p>
          </div>
        )}

        {error && (
          <div className="products-error">
            <h2>Unable to Load Products</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="products-toolbar">
              <div className="products-search">
                <label htmlFor="product-search">
                  Search Products
                </label>

                <input
                  id="product-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search by product or category"
                />
              </div>

              <div className="products-sort">
                <label htmlFor="product-category">
                  Category
                </label>

                <select
                  id="product-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option value="">All Categories</option>

                  {categories.map((categoryName) => (
                    <option
                      key={categoryName}
                      value={categoryName}
                    >
                      {categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="products-sort">
                <label htmlFor="product-sort">
                  Sort Products
                </label>

                <select
                  id="product-sort"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value)
                  }
                >
                  <option value="">Sort By</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">
                    Price: Low to High
                  </option>
                  <option value="price-high">
                    Price: High to Low
                  </option>
                </select>
              </div>
            </div>

            <p className="products-count">
              {sortedProducts.length}{" "}
              {sortedProducts.length === 1
                ? "Product"
                : "Products"}
            </p>

            {sortedProducts.length === 0 ? (
              <div className="no-products">
                <h2>No Products Found</h2>

                <p>
                  Try changing your search or category filter.
                </p>
              </div>
            ) : (
              <div className="products-grid">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={{
                      ...product,
                      id: product._id,
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default Products;
