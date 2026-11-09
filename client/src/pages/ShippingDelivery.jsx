
import { Link } from "react-router-dom";

function ShippingDelivery() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <p className="policy-eyebrow">CUSTOMER INFORMATION</p>
        <h1>Shipping &amp; Delivery</h1>
        <p>
          Everything you need to know about receiving your order.
        </p>
      </section>

      <section className="policy-content">
        <p className="policy-intro">
          We want your shopping experience to be simple from checkout
          to delivery. Please review the information below before
          placing your order.
        </p>

        <article className="policy-section">
          <h2>01. Order Processing</h2>
          <p>
            Orders are reviewed and prepared for dispatch after they
            are placed. Processing times may vary depending on product
            availability, order volume and public holidays.
          </p>
        </article>

        <article className="policy-section">
          <h2>02. Delivery Areas</h2>
          <p>
            Delivery availability depends on your shipping address and
            the courier service covering your area. Enter your complete
            address and contact number when placing an order.
          </p>
        </article>

        <article className="policy-section">
          <h2>03. Delivery Time</h2>
          <p>
            Estimated delivery times will be communicated by the store
            when confirmed. Delivery may take longer because of weather,
            courier delays, public holidays or circumstances outside
            our control.
          </p>
        </article>

        <article className="policy-section">
          <h2>04. Shipping Charges</h2>
          <p>
            Any applicable shipping charges should be displayed during
            checkout or confirmed before the order is placed. Please
            check the final order total before confirming your purchase.
          </p>
        </article>

        <article className="policy-section">
          <h2>05. Tracking Your Order</h2>
          <p>
            When tracking information is available, it will be shared
            with you through the contact details provided with your
            order. You can also review available order updates in your
            account.
          </p>
        </article>

        <article className="policy-section">
          <h2>06. Incorrect Address or Failed Delivery</h2>
          <p>
            Please make sure your address and phone number are correct.
            An incomplete address or an unsuccessful delivery attempt
            may cause delays or additional delivery arrangements.
          </p>
        </article>

        <article className="policy-section">
          <h2>07. Need Help?</h2>
          <p>
            If you have a question about your delivery, please contact
            our team and provide your order details.
          </p>

          <Link to="/contact" className="policy-button">
            Contact Us <span aria-hidden="true">→</span>
          </Link>
        </article>

        <p className="policy-note">
          Important: Before publishing, replace these general statements
          with your store's actual delivery areas, processing times,
          shipping fees and courier arrangements.
        </p>
      </section>
    </main>
  );
}

export default ShippingDelivery;
