import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getOrders,
  updateOrderStatus,
} from "../services/orderService";

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

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingOrderId, setUpdatingOrderId] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getOrders();

      setOrders(data);
    } catch (error) {
      console.error("Load orders error:", error);

      setError(
        error.message ||
          "Failed to load orders."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(
    orderId,
    newStatus
  ) {
    setError("");
    setSuccessMessage("");
    setUpdatingOrderId(orderId);

    try {
      const updatedOrder =
        await updateOrderStatus(
          orderId,
          newStatus
        );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === updatedOrder._id
            ? updatedOrder
            : order
        )
      );

      setSuccessMessage(
        `Order ${updatedOrder.orderNumber} status updated to ${formatStatus(
          updatedOrder.orderStatus
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
      setUpdatingOrderId("");
    }
  }

  if (isLoading) {
    return (
      <main>
        <section className="admin-orders-page">
          <div className="admin-orders-header">
            <p className="admin-orders-label">
              ADMIN
            </p>

            <h1>Orders</h1>

            <p>
              Loading customer orders...
            </p>
          </div>

          <div className="admin-orders-message">
            Loading orders...
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="admin-orders-page">
        <div className="admin-orders-header">
          <div>
            <p className="admin-orders-label">
              ADMIN
            </p>

            <h1>Orders</h1>

            <p>
              Manage customer orders and update
              their status.
            </p>
          </div>

          <div className="admin-orders-count">
            <span>Total Orders</span>

            <strong>{orders.length}</strong>
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

        {orders.length === 0 ? (
          <div className="admin-orders-empty">
            <h2>No Orders Found</h2>

            <p>
              Customer orders will appear here
              after they are placed.
            </p>
          </div>
        ) : (
          <div className="admin-orders-list">
            {orders.map((order) => (
              <article
                className="admin-order-card"
                key={order._id}
              >
                <div className="admin-order-top">
                  <div>
                    <p className="admin-order-label">
                      ORDER
                    </p>

                    <h2>
                      {order.orderNumber}
                    </h2>

                    <p className="admin-order-date">
                      {formatDate(
                        order.createdAt
                      )}
                    </p>
                  </div>

                  <div className="admin-order-total">
                    <span>Total</span>

                    <strong>
                      Rs.{" "}
                      {
                        order.pricing
                          ?.grandTotal
                      }
                    </strong>
                  </div>
                </div>

                <div className="admin-order-details">
                  <div>
                    <span>Customer</span>

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
                    <span>City</span>

                    <strong>
                      {order.customer?.city ||
                        "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>Payment</span>

                    <strong>
                      {order.paymentMethod ===
                      "cod"
                        ? "Cash on Delivery"
                        : order.paymentMethod}
                    </strong>
                  </div>

                  <div>
                    <span>Items</span>

                    <strong>
                      {order.items?.length || 0}
                    </strong>
                  </div>

                  <div>
                    <span>Current Status</span>

                    <strong>
                      {formatStatus(
                        order.orderStatus
                      )}
                    </strong>
                  </div>
                </div>

                <div className="admin-order-items">
                  <h3>Products</h3>

                  {order.items?.map(
                    (item, index) => (
                      <div
                        className="admin-order-item"
                        key={`${order._id}-${index}`}
                      >
                        <div>
                          <strong>
                            {item.name}
                          </strong>

                          <p>
                            Size:{" "}
                            {item.size || "N/A"}{" "}
                            | Color:{" "}
                            {item.color || "N/A"}{" "}
                            | Qty:{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <strong>
                          Rs.{" "}
                          {item.itemTotal}
                        </strong>
                      </div>
                    )
                  )}
                </div>

                <div className="admin-order-actions">
                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="admin-view-order-button"
                  >
                    View Order
                  </Link>

                  <div className="admin-order-status">
                    <label
                      htmlFor={`status-${order._id}`}
                    >
                      Update Status
                    </label>

                    <select
                      id={`status-${order._id}`}
                      value={order.orderStatus}
                      disabled={
                        updatingOrderId ===
                        order._id
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          order._id,
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
                            {formatStatus(
                              status
                            )}
                          </option>
                        )
                      )}
                    </select>

                    {updatingOrderId ===
                      order._id && (
                      <span>
                        Updating...
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminOrders;