import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

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

    const name =
      formData.name.trim();

    const email =
      formData.email.trim().toLowerCase();

    const password =
      formData.password;

    const confirmPassword =
      formData.confirmPassword;

    if (!name) {
      setError("Name is required.");
      return;
    }

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await register(
        name,
        email,
        password
      );

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Account created successfully. Please login.",
        },
      });
    } catch (error) {
      setError(
        error.message ||
          "Failed to create account."
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
              Create your account
            </h1>

            <p>
              Create an account to
              manage your orders and
              checkout faster next time.
            </p>
          </div>

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
              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                disabled={isSubmitting}
              />
            </div>

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
                placeholder="At least 6 characters"
                autoComplete="new-password"
                disabled={isSubmitting}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                placeholder="Enter password again"
                autoComplete="new-password"
                disabled={isSubmitting}
              />
            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?
            </p>

            <Link to="/login">
              Login
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

export default Register;