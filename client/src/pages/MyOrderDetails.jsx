
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { getMyOrderById } from "../services/orderService";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(dateString) {
  if (!dateString) return "Date unavailable";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatStatus(status) {
  if (!status) return "Unknown";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatPaymentMethod(paymentMethod) {
  if (paymentMethod === "cod") {
    return "Cash on Delivery";
  }

  return formatStatus(paymentMethod);
}

function getStatusDescription(status) {
  const descriptions = {
    pending: "Your order has been placed and is awaiting confirmation.",
    confirmed: "Your order has been confirmed by the store.",
    processing: "Your order is being prepared.",
    shipped: "Your order has been shipped.",
    delivered: "Your order has been delivered successfully.",
    cancelled: "This order has been cancelled.",
  };

  return descriptions[status] || "Your order status has been updated.";
}

function MyOrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadOrder = async () => {
      if (!token || !id) {
        setIsLoading(false);
        setError(
          !token
            ? "Please log in to view your order."
            : "Order ID is missing."
        );
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getMyOrderById(token, id);

        if (isActive) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Load order details error:", error);

        if (isActive) {
          setError(error.message || "Failed to load your order.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      isActive = false;
    };
  }, [token, id]);

  if (isLoading) {
    return (
      <main>
        <section className="my-order-details-page">
          <div className="my-order-details-header">
            <p className="account-label">CUSTOMER ACCOUNT</p>
            <h1>Order Details</h1>
            <p>Loading your order...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <section className="my-order-details-page">
          <div className="my-order-details-header">
            <p className="account-label">CUSTOMER ACCOUNT</p>
            <h1>Order Details</h1>
            <div className="checkout-error">{error}</div>
          </div>

          <div className="my-order-details-actions">
            <Link to="/account/orders">Back to My Orders</Link>
            <Link to="/products">Continue Shopping</Link>
          </div>
        </section>
      </main>
    );
  }

  if (!order) {
    return (
      <main>
        <section className="my-order-details-page">
          <h1>Order not found</h1>
          <Link to="/account/orders">Back to My Orders</Link>
        </section>
      </main>
    );
  }

  const currentStatus = order.orderStatus || "pending";
  const isCancelled = currentStatus === "cancelled";

  const history = Array.isArray(order.statusHistory)
    ? [...order.statusHistory].sort(
        (a, b) =>
          new Date(a.changedAt || 0).getTime() -
          new Date(b.changedAt || 0).getTime()
      )
    : [];

  const currentStatusIndex = ORDER_STATUSES.indexOf(currentStatus);

  return (
    <main>
      <section className="my-order-details-page">
        <div className="my-order-details-header">
          <p className="account-label">CUSTOMER ACCOUNT</p>
          <h1>Order Details</h1>
          <p>Order #{order.orderNumber}</p>
        </div>

        <div className="my-order-status-card">
          <div>
            <span>ORDER STATUS</span>
            <strong>{formatStatus(currentStatus)}</strong>
          </div>

          <div>
            <span>ORDER DATE</span>
            <strong>{formatDate(order.createdAt)}</strong>
          </div>
        </div>

        {/* ORDER TRACKING TIMELINE */}
        <section
          className="my-order-details-section"
          aria-labelledby="order-tracking-heading"
        >
          <h2 id="order-tracking-heading">Track Your Order</h2>

          <p style={{ color: "#666", marginBottom: "24px" }}>
            Follow the progress of your order below.
          </p>

          {isCancelled ? (
            <div
              style={{
                padding: "18px",
                border: "1px solid #e5b4b4",
                borderRadius: "10px",
                background: "#fff7f7",
              }}
            >
              <strong style={{ color: "#a12626" }}>
                Order Cancelled
              </strong>
              <p style={{ marginBottom: 0 }}>
                {getStatusDescription("cancelled")}
              </p>
            </div>
          ) : (
            <div style={{ marginBottom: "28px" }}>
              {ORDER_STATUSES.map((status, index) => {
                const isComplete =
                  currentStatusIndex >= 0 &&
                  index < currentStatusIndex;

                const isCurrent = status === currentStatus;

                const historyEntry = [...history]
                  .reverse()
                  .find((entry) => entry.status === status);

                const isReached = isComplete || isCurrent;

                return (
                  <div
                    key={status}
                    style={{
                      display: "flex",
                      gap: "14px",
                      minHeight: index === ORDER_STATUSES.length - 1
                        ? "auto"
                        : "88px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "28px",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "13px",
                          color: isReached ? "#fff" : "#777",
                          background: isReached ? "#202020" : "#eee",
                          border: isCurrent
                            ? "2px solid #202020"
                            : "2px solid transparent",
                        }}
                        aria-label={
                          isCurrent
                            ? "Current status"
                            : isComplete
                              ? "Completed status"
                              : "Upcoming status"
                        }
                      >
                        {isComplete ? "✓" : index + 1}
                      </div>

                      {index !== ORDER_STATUSES.length - 1 && (
                        <div
                          style={{
                            width: "2px",
                            flex: 1,
                            minHeight: "50px",
                            background: isComplete ? "#202020" : "#e5e5e5",
                          }}
                        />
                      )}
                    </div>

                    <div style={{ paddingBottom: "22px" }}>
                      <strong
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          color: isReached ? "#202020" : "#888",
                        }}
                      >
                        {formatStatus(status)}
                        {isCurrent ? " — Current status" : ""}
                      </strong>

                      <p
                        style={{
                          margin: "0 0 5px",
                          color: "#666",
                          lineHeight: 1.5,
                        }}
                      >
                        {getStatusDescription(status)}
                      </p>

                      {historyEntry?.changedAt && (
                        <span style={{ fontSize: "13px", color: "#777" }}>
                          {formatDateTime(historyEntry.changedAt)}
                        </span>
                      )}

                      {historyEntry?.note && (
                        <p
                          style={{
                            fontSize: "13px",
                            margin: "6px 0 0",
                            color: "#555",
                          }}
                        >
                          Note: {historyEntry.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div
            style={{
              borderTop: "1px solid #e5e5e5",
              paddingTop: "18px",
              marginTop: "10px",
            }}
          >
            <h3 style={{ marginBottom: "14px" }}>Status Update History</h3>

            {history.length > 0 ? (
              <div style={{ display: "grid", gap: "12px" }}>
                {history.map((entry, index) => (
                  <div
                    key={entry._id || `${entry.status}-${entry.changedAt}-${index}`}
                    style={{
                      padding: "14px",
                      border: "1px solid #e5e5e5",
                      borderRadius: "8px",
                    }}
                  >
                    <strong>{formatStatus(entry.status)}</strong>

                    <p
                      style={{
                        margin: "5px 0",
                        fontSize: "13px",
                        color: "#666",
                      }}
                    >
                      {formatDateTime(entry.changedAt)}
                    </p>

                    {entry.note && (
                      <p style={{ margin: 0 }}>{entry.note}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#666", lineHeight: 1.6 }}>
                Tracking history is not available for this order yet.
                Your current order status is{" "}
                <strong>{formatStatus(currentStatus)}</strong>.
              </p>
            )}
          </div>
        </section>

        <div className="my-order-details-section">
          <h2>Customer Information</h2>

          <div className="my-order-customer-info">
            <p>
              <span>Name</span>
              <strong>{order.customer?.name || "—"}</strong>
            </p>

            <p>
              <span>Phone</span>
              <strong>{order.customer?.phone || "—"}</strong>
            </p>

            <p>
              <span>Email</span>
              <strong>{order.customer?.email || "—"}</strong>
            </p>

            <p>
              <span>Address</span>
              <strong>{order.customer?.address || "—"}</strong>
            </p>

            <p>
              <span>City</span>
              <strong>{order.customer?.city || "—"}</strong>
            </p>

            <p>
              <span>Postal Code</span>
              <strong>{order.customer?.postalCode || "—"}</strong>
            </p>
          </div>
        </div>

        <div className="my-order-details-section">
          <h2>Order Items</h2>

          <div className="my-order-detail-items">
            {order.items?.map((item, index) => (
              <article
                className="my-order-detail-item"
                key={`${item.product}-${item.size}-${item.color}-${index}`}
              >
                <div>
                  <h3>{item.name}</h3>
                  <p>Size: {item.size || "—"}</p>
                  <p>Color: {item.color || "—"}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>

                <div>
                  <span>Unit Price</span>
                  <strong>Rs. {item.price}</strong>
                  <span>Item Total</span>
                  <strong>Rs. {item.itemTotal}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="my-order-details-section">
          <h2>Payment</h2>

          <div className="my-order-payment-info">
            <p>
              <span>Payment Method</span>
              <strong>
                {formatPaymentMethod(order.paymentMethod)}
              </strong>
            </p>

            <p>
              <span>Payment Status</span>
              <strong>{formatStatus(order.paymentStatus)}</strong>
            </p>
          </div>
        </div>

        <div className="my-order-details-section">
          <h2>Order Summary</h2>

          <div className="my-order-summary">
            <p>
              <span>Subtotal</span>
              <strong>Rs. {order.pricing?.subtotal ?? 0}</strong>
            </p>

            <p>
              <span>Shipping</span>
              <strong>Rs. {order.pricing?.shipping ?? 0}</strong>
            </p>

            <p>
              <span>Discount</span>
              <strong>Rs. {order.pricing?.discount ?? 0}</strong>
            </p>

            <p className="my-order-grand-total">
              <span>Grand Total</span>
              <strong>Rs. {order.pricing?.grandTotal ?? 0}</strong>
            </p>
          </div>
        </div>

        <div className="my-order-details-actions">
          <Link to="/account/orders">Back to My Orders</Link>
          <Link to="/products">Continue Shopping</Link>
        </div>
      </section>
    </main>
  );
}

export default MyOrderDetails;
