import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getOrders } from "../services/orderService";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getOrders();

      setOrders(data);
    } catch (error) {
      console.error(
        "Load dashboard data error:",
        error
      );

      setError(
        error.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const statusCounts = ORDER_STATUSES.reduce(
    (counts, status) => {
      counts[status] = orders.filter(
        (order) =>
          order.orderStatus === status
      ).length;

      return counts;
    },
    {}
  );

  const totalSales = orders.reduce(
    (total, order) => {
      return (
        total +
        (order.pricing?.grandTotal || 0)
      );
    },
    0
  );

  if (isLoading) {
    return (
      <main>
        <section className="admin-dashboard-page">
          <div className="admin-dashboard-header">
            <p className="admin-dashboard-label">
              ADMIN
            </p>

            <h1>Dashboard</h1>

            <p>
              Loading store information...
            </p>
          </div>

          <div className="admin-dashboard-message">
            Loading dashboard...
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="admin-dashboard-page">
        <div className="admin-dashboard-header">
          <div>
            <p className="admin-dashboard-label">
              ADMIN
            </p>

            <h1>Dashboard</h1>

            <p>
              Overview of your store orders and
              sales.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="admin-dashboard-orders-link"
          >
            Manage Orders
          </Link>
        </div>

        {error && (
          <div className="admin-dashboard-error">
            {error}
          </div>
        )}

        <div className="admin-dashboard-stats">
          <article className="admin-dashboard-stat">
            <span>Total Orders</span>

            <strong>{orders.length}</strong>
          </article>

          <article className="admin-dashboard-stat">
            <span>Pending</span>

            <strong>
              {statusCounts.pending || 0}
            </strong>
          </article>

          <article className="admin-dashboard-stat">
            <span>Confirmed</span>

            <strong>
              {statusCounts.confirmed || 0}
            </strong>
          </article>

          <article className="admin-dashboard-stat">
            <span>Processing</span>

            <strong>
              {statusCounts.processing || 0}
            </strong>
          </article>

          <article className="admin-dashboard-stat">
            <span>Shipped</span>

            <strong>
              {statusCounts.shipped || 0}
            </strong>
          </article>

          <article className="admin-dashboard-stat">
            <span>Delivered</span>

            <strong>
              {statusCounts.delivered || 0}
            </strong>
          </article>

          <article className="admin-dashboard-stat">
            <span>Cancelled</span>

            <strong>
              {statusCounts.cancelled || 0}
            </strong>
          </article>

          <article className="admin-dashboard-stat admin-dashboard-sales">
            <span>Total Sales</span>

            <strong>
              Rs. {totalSales}
            </strong>
          </article>
        </div>

        <section className="admin-dashboard-section">
          <div className="admin-dashboard-section-header">
            <div>
              <p className="admin-dashboard-label">
                RECENT ORDERS
              </p>

              <h2>Latest Orders</h2>
            </div>

            <Link to="/admin/orders">
              View All
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="admin-dashboard-empty">
              <h3>No Orders Yet</h3>

              <p>
                Customer orders will appear here
                after they are placed.
              </p>
            </div>
          ) : (
            <div className="admin-dashboard-orders">
              {orders
                .slice(0, 5)
                .map((order) => (
                  <article
                    className="admin-dashboard-order"
                    key={order._id}
                  >
                    <div>
                      <strong>
                        {order.orderNumber}
                      </strong>

                      <p>
                        {order.customer?.name ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <span>Status</span>

                      <strong>
                        {formatStatus(
                          order.orderStatus
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Total</span>

                      <strong>
                        Rs.{" "}
                        {
                          order.pricing
                            ?.grandTotal
                        }
                      </strong>
                    </div>

                    <Link
                      to={`/admin/orders/${order._id}`}
                    >
                      View
                    </Link>
                  </article>
                ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default AdminDashboard;