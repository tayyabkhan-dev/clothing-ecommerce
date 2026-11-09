import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

function Account() {
  const {
    user,
    logout,
  } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <main>
      <section className="account-page">
        <div className="account-header">
          <p className="account-label">
            CUSTOMER ACCOUNT
          </p>

          <h1>
            My Account
          </h1>

          <p>
            Manage your account and
            view your customer information.
          </p>
        </div>

        <div className="account-card">
          <div className="account-row">
            <span>
              Name
            </span>

            <strong>
              {user.name}
            </strong>
          </div>

          <div className="account-row">
            <span>
              Email
            </span>

            <strong>
              {user.email}
            </strong>
          </div>

          <div className="account-row">
            <span>
              Account status
            </span>

            <strong>
              {user.isActive
                ? "Active"
                : "Inactive"}
            </strong>
          </div>
        </div>

        <div className="account-actions">
          <Link to="/account/orders">
            My Orders
          </Link>

          <Link to="/products">
            Continue Shopping
          </Link>

          <button
            type="button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}

export default Account;