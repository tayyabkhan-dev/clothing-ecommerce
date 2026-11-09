import { Link } from "react-router-dom";

function Terms() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <p className="policy-eyebrow">PLEASE READ</p>
        <h1>Terms &amp; Conditions</h1>
        <p>
          The terms that apply when browsing and shopping with us.
        </p>
      </section>

      <section className="policy-content">
        <p className="policy-intro">
          These terms describe the general rules for using this
          website and placing orders. Please read them before
          making a purchase.
        </p>

        <article className="policy-section">
          <h2>01. Website Use</h2>
          <p>
            You agree to use this website lawfully and provide
            accurate information when creating an account,
            contacting us, or placing an order.
          </p>
        </article>

        <article className="policy-section">
          <h2>02. Products and Availability</h2>
          <p>
            Product images are intended to represent the items
            offered. Actual colours may vary depending on lighting
            and screen settings. Product availability and details
            should be confirmed on the relevant product page.
          </p>
        </article>

        <article className="policy-section">
          <h2>03. Prices and Orders</h2>
          <p>
            Prices, applicable charges, and order details should
            be reviewed before checkout. Submitting an order does
            not guarantee acceptance until the store's order
            confirmation process has been completed.
          </p>
        </article>

        <article className="policy-section">
          <h2>04. Payments</h2>
          <p>
            Available payment methods and any applicable charges
            will be shown during checkout. Orders may be subject
            to payment verification where applicable.
          </p>
        </article>

        <article className="policy-section">
          <h2>05. Shipping and Delivery</h2>
          <p>
            Delivery arrangements, estimated timeframes, and
            applicable charges are described on our Shipping &
            Delivery page. Actual delivery times may vary by
            location and circumstances.
          </p>

          <Link to="/shipping-delivery" className="policy-button">
            Shipping &amp; Delivery <span aria-hidden="true">→</span>
          </Link>
        </article>

        <article className="policy-section">
          <h2>06. Returns and Refunds</h2>
          <p>
            Return, exchange, and refund requests are subject to
            the store's confirmed policy and applicable law.
            Please review the Returns &amp; Refunds page before
            requesting a return.
          </p>

          <Link to="/return-policy" className="policy-button">
            Returns &amp; Refunds <span aria-hidden="true">→</span>
          </Link>
        </article>

        <article className="policy-section">
          <h2>07. Accounts and Security</h2>
          <p>
            You are responsible for keeping your account
            credentials secure and notifying the store if you
            suspect unauthorised use of your account.
          </p>
        </article>

        <article className="policy-section">
          <h2>08. Changes to These Terms</h2>
          <p>
            The store may update these terms when necessary.
            Updated terms should be published on this page with
            an appropriate effective date.
          </p>
        </article>

        <article className="policy-section">
          <h2>09. Contact Us</h2>
          <p>
            If you have questions about these terms, contact our
            support team.
          </p>

          <Link to="/contact" className="policy-button">
            Contact Support <span aria-hidden="true">→</span>
          </Link>
        </article>

        <p className="policy-note">
          Important: this is a starter template, not legal advice.
          Before launching the store, confirm your actual business
          rules, cancellation process, payment terms, liability
          provisions, effective date, and applicable legal
          requirements.
        </p>
      </section>
    </main>
  );
}

export default Terms;