
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const successMessage =
    location.state?.message || "";

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const email =
      formData.email.trim().toLowerCase();

    const password =
      formData.password;

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await login(
        email,
        password
      );

      // Admin ko direct dashboard par bhejo
      if (data.user?.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        // Customer ko products page par bhejo
        navigate("/products", {
          replace: true,
        });
      }
    } catch (error) {
      setError(
        error.message ||
          "Failed to login."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <section className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <p className="auth-label">
              CUSTOMER ACCOUNT
            </p>

            <h1>
              Welcome back
            </h1>

            <p>
              Login to manage your
              orders and checkout faster.
            </p>
          </div>

          {successMessage && (
            <div className="auth-success">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="auth-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?
            </p>

            <Link to="/register">
              Create account
            </Link>
          </div>

          <div className="auth-guest">
            <p>
              You can also shop without
              creating an account.
            </p>

            <Link to="/products">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
