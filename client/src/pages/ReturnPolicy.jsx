
import { Link } from "react-router-dom";

function ReturnPolicy() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <p className="policy-eyebrow">CUSTOMER CARE</p>
        <h1>Returns &amp; Refunds</h1>
        <p>Clear information about return and refund requests.</p>
      </section>

      <section className="policy-content">
        <p className="policy-intro">
          We want you to feel confident when shopping with us.
          Please review our return information before placing an order.
        </p>

        <article className="policy-section">
          <h2>01. Return Eligibility</h2>
          <p>
            To request a return, contact our support team with your
            order details and explain the reason for your request.
            Eligibility will depend on the store's confirmed policy
            and the condition of the item.
          </p>
        </article>

        <article className="policy-section">
          <h2>02. Item Condition</h2>
          <p>
            Keep the item, original packaging, tags and proof of
            purchase until your request has been reviewed. Please
            contact support before sending anything back.
          </p>
        </article>

        <article className="policy-section">
          <h2>03. Damaged or Incorrect Items</h2>
          <p>
            If your order arrives damaged or you receive the wrong
            item, contact us with your order number and clear photos
            of the item and packaging.
          </p>
        </article>

        <article className="policy-section">
          <h2>04. Refunds</h2>
          <p>
            If a refund is approved, our team will explain the refund
            method and expected processing time. The time required
            may depend on the original payment method and payment
            provider.
          </p>
        </article>

        <article className="policy-section">
          <h2>05. Exchanges</h2>
          <p>
            If you need a different size or item, contact support to
            confirm whether an exchange is available and whether the
            requested item is in stock.
          </p>
        </article>

        <article className="policy-section">
          <h2>06. How to Request Help</h2>
          <p>
            Contact our team with your order number, registered
            contact details and a description of the issue.
          </p>

          <Link to="/contact" className="policy-button">
            Contact Support <span aria-hidden="true">→</span>
          </Link>
        </article>

        <p className="policy-note">
          Store setup required: confirm your actual return window,
          eligible and excluded items, exchange rules, return shipping
          costs and refund timelines before publishing this policy.
        </p>
      </section>
    </main>
  );
}

export default ReturnPolicy;
