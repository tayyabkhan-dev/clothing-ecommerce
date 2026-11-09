import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext.jsx";
import { calculateSubtotal } from "../utils/cartUtils";

function OrderReview() {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems, clearCart } = useCart();

  const { token } = useAuth();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const checkoutData = location.state;

  if (
    !checkoutData ||
    !checkoutData.customer
  ) {
    return (
      <main>
        <section className="order-review-page">
          <div className="order-review-header">
            <p className="cart-label">
              ORDER REVIEW
            </p>

            <h1>
              Checkout information missing
            </h1>

            <p>
              Please return to checkout and
              enter your information again.
            </p>
          </div>

          <Link
            to="/checkout"
            className="back-to-checkout-button"
          >
            Back to Checkout
          </Link>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main>
        <section className="order-review-page">
          <div className="order-review-header">
            <p className="cart-label">
              ORDER REVIEW
            </p>

            <h1>
              Your cart is empty
            </h1>

            <p>
              There are no products available
              to place an order.
            </p>
          </div>

          <Link
            to="/products"
            className="back-to-checkout-button"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  const subtotal =
    calculateSubtotal(cartItems);

  const customer =
    checkoutData.customer;

  const paymentMethod =
    checkoutData.paymentMethod;

  const handleConfirmOrder =
    async () => {
      setError("");
      setIsSubmitting(true);

      try {
        const orderItems =
          cartItems.map((item) => ({
            product: item.id,
            size: item.size || "",
            color: item.color || "",
            quantity: item.quantity,
          }));

        /*
          Guest checkout:
          No Authorization header.

          Logged-in customer:
          Send JWT token so the backend
          can link the order to the
          authenticated User.
        */
        const headers = {
          "Content-Type":
            "application/json",
        };

        if (token) {
          headers.Authorization =
            `Bearer ${token}`;
        }

        const response =
          await fetch(
            "http://localhost:5000/api/orders",
            {
              method: "POST",
              headers,
              body: JSON.stringify({
                customer,
                items: orderItems,
                paymentMethod,
              }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to place order."
          );
        }

        /*
          Clear cart only after backend
          successfully creates the order.
        */
        clearCart();

        navigate(
          "/order-confirmation",
          {
            state: {
              order: data.order,
            },
          }
        );
      } catch (error) {
        console.error(
          "Place order error:",
          error
        );

        setError(
          error.message ||
            "Something went wrong while placing your order."
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <main>
      <section className="order-review-page">
        <div className="order-review-header">
          <p className="cart-label">
            ORDER REVIEW
          </p>

          <h1>
            Review Your Order
          </h1>

          <p>
            Please check your information
            and products before placing
            your order.
          </p>
        </div>

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <div className="order-review-section">
          <div className="section-heading-row">
            <h2>
              Customer Information
            </h2>

            <Link to="/checkout">
              Edit
            </Link>
          </div>

          <div className="review-information">
            <p>
              <strong>
                Name:
              </strong>{" "}
              {customer.name}
            </p>

            <p>
              <strong>
                Phone:
              </strong>{" "}
              {customer.phone}
            </p>

            <p>
              <strong>
                Email:
              </strong>{" "}
              {customer.email}
            </p>

            <p>
              <strong>
                Address:
              </strong>{" "}
              {customer.address}
            </p>

            <p>
              <strong>
                City:
              </strong>{" "}
              {customer.city}
            </p>

            <p>
              <strong>
                Postal Code:
              </strong>{" "}
              {customer.postalCode}
            </p>
          </div>
        </div>

        <div className="order-review-section">
          <h2>
            Order Items
          </h2>

          <div className="order-review-items">
            {cartItems.map((item) => (
              <article
                className="order-review-item"
                key={`${item.id}-${item.size}-${item.color}`}
              >
                <div>
                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Size: {item.size}
                  </p>

                  <p>
                    Color: {item.color}
                  </p>

                  <p>
                    Quantity: {item.quantity}
                  </p>
                </div>

                <strong>
                  Rs.{" "}
                  {item.price *
                    item.quantity}
                </strong>
              </article>
            ))}
          </div>
        </div>

        <div className="order-review-section">
          <h2>
            Payment
          </h2>

          <div className="review-payment">
            <p>
              <strong>
                Payment Method:
              </strong>{" "}
              {paymentMethod === "cod"
                ? "Cash on Delivery"
                : paymentMethod}
            </p>
          </div>
        </div>

        <div className="order-review-section">
          <h2>
            Order Total
          </h2>

          <div className="checkout-totals">
            <p>
              <span>
                Subtotal
              </span>

              <strong>
                Rs. {subtotal}
              </strong>
            </p>

            <p>
              <span>
                Shipping
              </span>

              <strong>
                Calculated by store
              </strong>
            </p>

            <p>
              <span>
                Discount
              </span>

              <strong>
                Calculated by store
              </strong>
            </p>

            <p className="checkout-grand-total">
              <span>
                Total
              </span>

              <strong>
                Backend will calculate
              </strong>
            </p>
          </div>
        </div>

        <div className="order-review-actions">
          <Link
            to="/checkout"
            className="back-to-checkout-button"
          >
            Back to Checkout
          </Link>

          <button
            type="button"
            className="confirm-order-button"
            onClick={
              handleConfirmOrder
            }
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Placing Order..."
              : "Confirm Order"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default OrderReview;