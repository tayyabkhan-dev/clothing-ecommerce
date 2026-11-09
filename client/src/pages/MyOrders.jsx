
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import {
  getMyOrders,
  cancelMyOrder,
} from "../services/orderService";

function formatDate(dateString) {
  if (!dateString) {
    return "—";
  }

  return new Date(dateString).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function MyOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getMyOrders(token);

        setOrders(
          Array.isArray(data.orders) ? data.orders : []
        );
      } catch (error) {
        console.error("Load my orders error:", error);
        setError(error.message || "Failed to load your orders.");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  async function handleCancelOrder(order) {
    const confirmed = window.confirm(
      `Are you sure you want to cancel order ${order.orderNumber}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingOrderId(order._id);
      setError("");
      setNotice("");

      const result = await cancelMyOrder(token, order._id);

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder._id === order._id
            ? {
                ...currentOrder,
                orderStatus: "cancelled",
              }
            : currentOrder
        )
      );

      setNotice(
        result.message || "Order cancelled successfully."
      );
    } catch (error) {
      console.error("Cancel order error:", error);
      setError(error.message || "Failed to cancel order.");
    } finally {
      setCancellingOrderId("");
    }
  }

  if (isLoading) {
    return (
      <main>
        <section className="my-orders-page">
          <div className="my-orders-header">
            <p className="account-label">CUSTOMER ACCOUNT</p>
            <h1>My Orders</h1>
            <p>Loading your orders...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="my-orders-page">
        <div className="my-orders-header">
          <p className="account-label">CUSTOMER ACCOUNT</p>

          <h1>My Orders</h1>

          <p>
            View your previous orders and check their current status.
          </p>
        </div>

        {error && (
          <div className="checkout-error" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div className="my-orders-notice" role="status">
            {notice}
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="my-orders-empty">
            <h2>No orders yet</h2>

            <p>
              You have not placed any orders from this account yet.
            </p>

            <Link to="/products">Start Shopping</Link>
          </div>
        )}

        {!error && orders.length > 0 && (
          <div className="my-orders-list">
            {orders.map((order) => {
              const canCancel = ["pending", "confirmed"].includes(
                order.orderStatus
              );

              const isCancelling =
                cancellingOrderId === order._id;

              return (
                <article
                  className="my-order-card"
                  key={order._id}
                >
                  <div className="my-order-top">
                    <div>
                      <p className="my-order-label">
                        ORDER NUMBER
                      </p>

                      <h2>{order.orderNumber}</h2>
                    </div>

                    <div className="my-order-status">
                      {formatStatus(order.orderStatus)}
                    </div>
                  </div>

                  <div className="my-order-info">
                    <div>
                      <span>Date</span>
                      <strong>{formatDate(order.createdAt)}</strong>
                    </div>

                    <div>
                      <span>Items</span>
                      <strong>{order.items?.length || 0}</strong>
                    </div>

                    <div>
                      <span>Payment</span>
                      <strong>
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : order.paymentMethod}
                      </strong>
                    </div>

                    <div>
                      <span>Total</span>
                      <strong>
                        Rs. {order.pricing?.grandTotal}
                      </strong>
                    </div>
                  </div>

                  <div className="my-order-bottom">
                    <span>
                      Payment status:{" "}
                      {formatStatus(order.paymentStatus)}
                    </span>

                    <div className="my-order-buttons">
                      <Link to={`/account/orders/${order._id}`}>
                        View Details
                      </Link>

                      {canCancel && (
                        <button
                          type="button"
                          className="cancel-order-button"
                          disabled={Boolean(cancellingOrderId)}
                          onClick={() => handleCancelOrder(order)}
                        >
                          {isCancelling
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="my-orders-actions">
          <Link to="/account">Back to My Account</Link>
          <Link to="/products">Continue Shopping</Link>
        </div>
      </section>
    </main>
  );
}

export default MyOrders;
