import {
  Link,
  useLocation,
} from "react-router-dom";

function AdminNav() {
  const location = useLocation();

  return (
    <nav className="admin-nav">
      <div className="admin-nav-brand">
        <Link to="/admin">
          Admin Panel
        </Link>
      </div>

      <div className="admin-nav-links">
        <Link
          to="/admin"
          className={
            location.pathname === "/admin"
              ? "admin-nav-active"
              : ""
          }
        >
          Dashboard
        </Link>

        <Link
          to="/admin/orders"
          className={
            location.pathname.startsWith(
              "/admin/orders"
            )
              ? "admin-nav-active"
              : ""
          }
        >
          Orders
        </Link>

        <Link
          to="/admin/products"
          className={
            location.pathname.startsWith(
              "/admin/products"
            )
              ? "admin-nav-active"
              : ""
          }
        >
          Products
        </Link>
      </div>
    </nav>
  );
}

export default AdminNav;