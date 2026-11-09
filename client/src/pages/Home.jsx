
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Headset,
  Sparkles,
} from "lucide-react";

import heroImage from "../assets/hero image pic .png";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

function Home() {
  const [products, setProducts] = useState([]);
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
            requestError.message ||
              "Unable to load featured products."
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
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  const featuredProducts = products.slice(0, 4);

  return (
    <main className="home-page">
      {/* Hero Banner */}
      <section
        className="hero"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="hero-content">
          <p className="hero-label">THE NEW COLLECTION</p>

          <h1>
            Timeless Style.
            <br />
            Modern Living.
          </h1>

          <p className="hero-description">
            Discover refined essentials designed for everyday
            elegance, comfort, and confidence.
          </p>

          <Link to="/products" className="hero-button">
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Brand Introduction */}
      <section className="home-intro">
        <p className="home-section-label">LESS, BUT BETTER</p>

        <h2>
          Everyday essentials.
          <br />
          Made for your style.
        </h2>

        <p>
          Discover thoughtfully selected menswear that brings
          together timeless design, everyday comfort, and
          effortless sophistication.
        </p>
      </section>

      {/* Featured Products */}
      <section className="home-featured">
        <div className="home-section-heading">
          <div>
            <p className="home-section-label">SELECTED FOR YOU</p>
            <h2>Featured Collection</h2>
            <p>
              Explore pieces to make everyday dressing feel
              effortless.
            </p>
          </div>

          <Link to="/products" className="home-text-link">
            View all products
            <ArrowRight size={17} />
          </Link>
        </div>

        {loading && (
          <p className="home-status">Loading collection...</p>
        )}

        {error && (
          <div className="home-status">
            <p>{error}</p>
            <Link to="/products">Browse all products</Link>
          </div>
        )}

        {!loading && !error && featuredProducts.length === 0 && (
          <div className="home-empty">
            <Sparkles size={24} />
            <h3>Your next favourite piece is on its way.</h3>
            <p>There are no products to display just yet.</p>
            <Link to="/products" className="home-text-link">
              Explore the store <ArrowRight size={17} />
            </Link>
          </div>
        )}

        {!loading && !error && featuredProducts.length > 0 && (
          <div className="home-products-grid">
            {featuredProducts.map((product) => (
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
      </section>

      {/* Shop by Category */}
      {!loading && categories.length > 0 && (
        <section className="home-categories">
          <div className="home-section-heading">
            <div>
              <p className="home-section-label">FIND YOUR LOOK</p>
              <h2>Shop by Category</h2>
            </div>
          </div>

          <div className="home-category-grid">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category}
                to="/products"
                className="home-category-card"
              >
                <span>{category}</span>
                <ArrowRight size={19} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Brand Story */}
      <section className="home-story">
        <div className="home-story-content">
          <p className="home-section-label">OUR PHILOSOPHY</p>

          <h2>
            Style that goes
            <br />
            beyond seasons.
          </h2>

          <p>
            We believe great style does not need to be
            complicated. Our focus is on versatile essentials,
            considered details, and pieces that feel right
            wherever the day takes you.
          </p>

          <Link to="/products" className="home-story-button">
            Discover the collection
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="home-story-decoration">
          <span>TIMELESS</span>
          <span>REFINED</span>
          <span>EVERYDAY</span>
        </div>
      </section>

      {/* Shopping Benefits */}
      <section className="home-benefits">
        <div className="home-benefit">
          <Truck size={27} strokeWidth={1.5} />
          <h3>Delivery Information</h3>
          <p>
            Find delivery details and estimated shipping times
            in our shipping policy.
          </p>
          <Link to="/shipping-policy">Shipping details</Link>
        </div>

        <div className="home-benefit">
          <ShieldCheck size={27} strokeWidth={1.5} />
          <h3>Clear Return Policy</h3>
          <p>
            Review our return and refund terms before placing
            your order.
          </p>
          <Link to="/return-policy">Returns & refunds</Link>
        </div>

        <div className="home-benefit">
          <Headset size={27} strokeWidth={1.5} />
          <h3>Here to Help</h3>
          <p>
            Have a question about your order or our collection?
            Get in touch with us.
          </p>
          <Link to="/contact">Contact us</Link>
        </div>
      </section>

      {/* Newsletter - visual section for now */}
      <section className="home-newsletter">
        <p className="home-section-label">STAY IN THE KNOW</p>

        <h2>A little more style in your inbox.</h2>

        <p>
          Explore our latest arrivals and discover timeless
          essentials for your wardrobe.
        </p>

        <Link to="/products" className="home-newsletter-button">
          Explore new arrivals
          <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}

export default Home;
