import { Link, useLocation } from "react-router-dom";

function OrderConfirmation() {
  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <main>
        <section className="order-confirmation-page">
          <div className="order-confirmation-card">
            <p className="confirmation-label">
              ORDER INFORMATION
            </p>

            <h1>Order Information Not Found</h1>

            <p>
              Please return to the products page and
              place your order again.
            </p>

            <Link to="/products">
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="order-confirmation-page">
        <div className="order-confirmation-card">
          <div className="confirmation-icon">
            ✓
          </div>

          <p className="confirmation-label">
            ORDER CONFIRMED
          </p>

          <h1>Thank You for Your Order!</h1>

          <p>
            Your order has been successfully placed.
          </p>

          <div className="confirmation-order-number">
            <span>Order Number</span>

            <strong>
              {order.orderNumber}
            </strong>
          </div>

          <div className="confirmation-details">
            <p>
              <strong>Customer:</strong>{" "}
              {order.customer.name}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {order.customer.phone}
            </p>

            <p>
              <strong>City:</strong>{" "}
              {order.customer.city}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              Cash on Delivery
            </p>

            <p>
              <strong>Order Status:</strong>{" "}
              {order.orderStatus}
            </p>

            <p>
              <strong>Total:</strong>{" "}
              Rs. {order.pricing.grandTotal}
            </p>
          </div>

          <div className="confirmation-note">
            <p>
              Your order has been received. We will
              process it according to the current order
              status.
            </p>
          </div>

          <Link to="/products">
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OrderConfirmation;