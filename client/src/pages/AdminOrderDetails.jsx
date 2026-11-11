import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";
import {
  Link,
  useParams,
} from "react-router-dom";

const API_URL = `${API_BASE_URL}/api/orders`;
const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatDate(date) {
  if (!date) {
    return "N/A";
  }

  return new Date(date).toLocaleString();
}

function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

function AdminOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] =
    useState(false);
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/${id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch order."
        );
      }

      setOrder(data.order);
    } catch (error) {
      console.error(
        "Load order details error:",
        error
      );

      setError(
        error.message ||
          "Failed to load order details."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(
    newStatus
  ) {
    if (!order) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsUpdating(true);

    try {
      const response = await fetch(
        `${API_URL}/${order._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update order status."
        );
      }

      setOrder(data.order);

      setSuccessMessage(
        `Order status updated to ${formatStatus(
          data.order.orderStatus
        )}.`
      );
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      setError(
        error.message ||
          "Failed to update order status."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <main>
        <section className="admin-order-details-page">
          <div className="admin-order-details-message">
            Loading order details...
          </div>
        </section>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main>
        <section className="admin-order-details-page">
          <div className="admin-order-details-error">
            <h1>Order Not Found</h1>

            <p>{error}</p>

            <Link to="/admin/orders">
              Back to Orders
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="admin-order-details-page">
        <div className="admin-order-details-header">
          <div>
            <Link
              to="/admin/orders"
              className="admin-back-link"
            >
              ← Back to Orders
            </Link>

            <p className="admin-orders-label">
              ADMIN / ORDER DETAILS
            </p>

            <h1>
              {order.orderNumber}
            </h1>

            <p>
              Placed on{" "}
              {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="admin-detail-status">
            <span>Current Status</span>

            <strong>
              {formatStatus(
                order.orderStatus
              )}
            </strong>
          </div>
        </div>

        {error && (
          <div className="admin-orders-error">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="admin-orders-success">
            {successMessage}
          </div>
        )}

        <div className="admin-order-detail-grid">
          <section className="admin-detail-section">
            <h2>Customer Information</h2>

            <div className="admin-detail-information">
              <div>
                <span>Name</span>

                <strong>
                  {order.customer?.name ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>Phone</span>

                <strong>
                  {order.customer?.phone ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {order.customer?.email ||
                    "N/A"}
                </strong>
              </div>
            </div>
          </section>

          <section className="admin-detail-section">
            <h2>Shipping Address</h2>

            <div className="admin-detail-information">
              <div>
                <span>Address</span>

                <strong>
                  {order.customer?.address ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>City</span>

                <strong>
                  {order.customer?.city ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>Postal Code</span>

                <strong>
                  {order.customer?.postalCode ||
                    "N/A"}
                </strong>
              </div>
            </div>
          </section>
        </div>

        <section className="admin-detail-section">
          <h2>Order Items</h2>

          <div className="admin-detail-items">
            {order.items?.map(
              (item, index) => (
                <article
                  className="admin-detail-item"
                  key={`${order._id}-${index}`}
                >
                  <div>
                    <h3>{item.name}</h3>

                    <p>
                      Size:{" "}
                      {item.size || "N/A"}
                    </p>

                    <p>
                      Color:{" "}
                      {item.color || "N/A"}
                    </p>

                    <p>
                      Quantity:{" "}
                      {item.quantity}
                    </p>

                    <p>
                      Unit Price: Rs.{" "}
                      {item.price}
                    </p>
                  </div>

                  <strong>
                    Rs. {item.itemTotal}
                  </strong>
                </article>
              )
            )}
          </div>
        </section>

        <div className="admin-order-detail-grid">
          <section className="admin-detail-section">
            <h2>Payment</h2>

            <div className="admin-detail-information">
              <div>
                <span>Method</span>

                <strong>
                  {order.paymentMethod ===
                  "cod"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </strong>
              </div>

              <div>
                <span>Payment Status</span>

                <strong>
                  {formatStatus(
                    order.paymentStatus
                  )}
                </strong>
              </div>
            </div>
          </section>

          <section className="admin-detail-section">
            <h2>Order Status</h2>

            <div className="admin-status-control">
              <label htmlFor="order-status">
                Update Status
              </label>

              <select
                id="order-status"
                value={order.orderStatus}
                disabled={isUpdating}
                onChange={(event) =>
                  handleStatusChange(
                    event.target.value
                  )
                }
              >
                {ORDER_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {formatStatus(status)}
                    </option>
                  )
                )}
              </select>

              {isUpdating && (
                <span>
                  Updating...
                </span>
              )}
            </div>
          </section>
        </div>

        <section className="admin-detail-section">
          <h2>Order Summary</h2>

          <div className="admin-detail-summary">
            <div>
              <span>Subtotal</span>

              <strong>
                Rs.{" "}
                {order.pricing?.subtotal ??
                  0}
              </strong>
            </div>

            <div>
              <span>Shipping</span>

              <strong>
                Rs.{" "}
                {order.pricing?.shipping ??
                  0}
              </strong>
            </div>

            <div>
              <span>Discount</span>

              <strong>
                Rs.{" "}
                {order.pricing?.discount ??
                  0}
              </strong>
            </div>

            <div className="admin-detail-grand-total">
              <span>Total</span>

              <strong>
                Rs.{" "}
                {order.pricing?.grandTotal ??
                  0}
              </strong>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default AdminOrderDetails;