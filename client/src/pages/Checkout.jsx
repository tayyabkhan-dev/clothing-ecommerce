import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  calculateItemTotal,
  calculateSubtotal,
} from "../utils/cartUtils";

function Checkout() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [error, setError] = useState("");

  const subtotal = calculateSubtotal(cartItems);

  // Temporary frontend values.
  // Backend will calculate these values later.
  const shipping = 0;
  const discount = 0;

  const grandTotal =
    subtotal + shipping - discount;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCustomer((currentCustomer) => ({
      ...currentCustomer,
      [name]: value,
    }));

    setError("");
  };

  const validateCustomer = () => {
    if (customer.name.trim().length < 2) {
      return "Please enter your full name.";
    }

    const phoneRegex = /^03\d{9}$/;

    if (!phoneRegex.test(customer.phone.trim())) {
      return "Please enter a valid Pakistani phone number, for example 03001234567.";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(customer.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (customer.address.trim().length < 5) {
      return "Please enter a complete delivery address.";
    }

    if (customer.city.trim().length < 2) {
      return "Please enter a valid city.";
    }

    const postalCodeRegex = /^\d{4,6}$/;

    if (
      !postalCodeRegex.test(
        customer.postalCode.trim()
      )
    ) {
      return "Please enter a valid postal code.";
    }

    if (paymentMethod !== "cod") {
      return "Please select a valid payment method.";
    }

    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (cartItems.length === 0) {
      setError(
        "Your cart is empty. Please add a product before checkout."
      );
      return;
    }

    const invalidQuantity = cartItems.some(
      (item) =>
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
    );

    if (invalidQuantity) {
      setError(
        "One or more products have an invalid quantity."
      );
      return;
    }

    const validationError = validateCustomer();

    if (validationError) {
      setError(validationError);
      return;
    }

    navigate("/order-review", {
      state: {
        customer: {
          name: customer.name.trim(),
          phone: customer.phone.trim(),
          email: customer.email.trim(),
          address: customer.address.trim(),
          city: customer.city.trim(),
          postalCode: customer.postalCode.trim(),
        },
        paymentMethod,
        pricing: {
          subtotal,
          shipping,
          discount,
          grandTotal,
        },
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <main>
        <section className="checkout-page">
          <div className="checkout-empty">
            <p className="checkout-label">
              CHECKOUT
            </p>

            <h1>Your Cart Is Empty</h1>

            <p>
              Please add a product to your cart before
              continuing to checkout.
            </p>

            <Link
              to="/products"
              className="continue-shopping-button"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="checkout-page">
        <div className="checkout-header">
          <p className="checkout-label">
            CHECKOUT
          </p>

          <h1>Complete Your Order</h1>

          <p>
            Enter your delivery information and choose
            your payment method.
          </p>
        </div>

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <div className="checkout-section">
            <h2>Customer Information</h2>

            <div className="checkout-field">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={customer.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={customer.phone}
                onChange={handleChange}
                placeholder="03001234567"
                inputMode="numeric"
                maxLength="11"
                autoComplete="tel"
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={customer.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="address">
                Delivery Address
              </label>

              <textarea
                id="address"
                name="address"
                value={customer.address}
                onChange={handleChange}
                placeholder="House number, street, area..."
                rows="4"
                autoComplete="street-address"
              />
            </div>

            <div className="checkout-two-columns">
              <div className="checkout-field">
                <label htmlFor="city">
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={customer.city}
                  onChange={handleChange}
                  placeholder="Islamabad"
                  autoComplete="address-level2"
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="postalCode">
                  Postal Code
                </label>

                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={customer.postalCode}
                  onChange={handleChange}
                  placeholder="44000"
                  inputMode="numeric"
                  maxLength="6"
                  autoComplete="postal-code"
                />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2>Payment Method</h2>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={
                  paymentMethod === "cod"
                }
                onChange={(event) =>
                  setPaymentMethod(
                    event.target.value
                  )
                }
              />

              <span>
                <strong>
                  Cash on Delivery
                </strong>

                <small>
                  Pay when your order is delivered.
                </small>
              </span>
            </label>
          </div>

          <div className="checkout-section">
            <h2>Order Summary</h2>

            <div className="checkout-items">
              {cartItems.map((item) => (
                <div
                  className="checkout-item"
                  key={`${item.id}-${item.size}-${item.color}`}
                >
                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.size} / {item.color} ×{" "}
                      {item.quantity}
                    </span>
                  </div>

                  <strong>
                    Rs. {calculateItemTotal(item)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div>
                <span>Subtotal</span>
                <strong>
                  Rs. {subtotal}
                </strong>
              </div>

              <div>
                <span>Shipping</span>
                <strong>
                  {shipping === 0
                    ? "Free"
                    : `Rs. ${shipping}`}
                </strong>
              </div>

              <div>
                <span>Discount</span>
                <strong>
                  Rs. {discount}
                </strong>
              </div>

              <hr />

              <div className="checkout-grand-total">
                <span>Grand Total</span>
                <strong>
                  Rs. {grandTotal}
                </strong>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="place-order-button"
          >
            Continue to Review Order
          </button>
        </form>
      </section>
    </main>
  );
}

export default Checkout;