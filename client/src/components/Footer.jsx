
import { Link } from "react-router-dom";
import heroImage from "../assets/hero image pic .png";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <section
        className="footer-promo"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="footer-promo-overlay">
          <p className="footer-promo-label">
            THE ART OF EVERYDAY DRESSING
          </p>

          <h2>Quality You Can Feel</h2>

          <p>
            Premium fabrics. Timeless design. Everyday comfort.
          </p>

          <Link to="/products" className="footer-promo-button">
            Discover More <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <div className="footer-main">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              OneNO
            </Link>

            <p className="footer-brand-description">
              Premium Clothing Store
            </p>

            <div className="footer-socials">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <span className="footer-social-letter">f</span>
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <span className="footer-social-letter">◎</span>
              </a>

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <span className="footer-social-play">▶</span>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/products">Shop</Link>
            <Link to="/products">Collections</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/about">About Us</Link>
          </div>

          <div className="footer-column">
            <h3>Customer Care</h3>
            <Link to="/shipping-delivery">Shipping</Link>
            <Link to="/return-policy">Returns &amp; Refunds</Link>
            <Link to="/account/orders">My Orders</Link>
            <Link to="/faq">FAQs</Link>
            <Link to="/contact">Help &amp; Support</Link>
          </div>

          <div className="footer-newsletter">
            <h3>Newsletter</h3>

            <p>
              Get the latest updates and exclusive offers.
            </p>

            <form
              className="footer-newsletter-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <label
                className="footer-sr-only"
                htmlFor="footer-newsletter-email"
              >
                Your email address
              </label>

              <input
                id="footer-newsletter-email"
                type="email"
                placeholder="Enter your email"
                required
              />

              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                title="Subscribe"
              >
                <span aria-hidden="true">→</span>
              </button>
            </form>

            <p className="footer-newsletter-note">
              Stay connected with our latest collection.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} Our Store. All rights reserved.
          </p>

          <div className="footer-legal-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
