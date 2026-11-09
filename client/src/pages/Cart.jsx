
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  calculateItemTotal,
  calculateSubtotal,
} from "../utils/cartUtils";

function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const subtotal = calculateSubtotal(cartItems);

  if (cartItems.length === 0) {
    return (
      <main className="cart-main">
        <section className="cart-page">
          <div className="cart-header">
            <p className="cart-label">YOUR SHOPPING BAG</p>
            <h1>Your Cart</h1>
            <p>Your selected pieces, all in one place.</p>
          </div>

          <div className="cart-empty">
            <div className="cart-empty-icon" aria-hidden="true">
              ♡
            </div>

            <p className="cart-label">A LITTLE SOMETHING IS MISSING</p>
            <h2>Your cart is waiting</h2>
            <p>
              Discover timeless essentials and find something
              that feels uniquely yours.
            </p>

            <Link to="/products" className="cart-primary-button">
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-main">
      <section className="cart-page">
        <div className="cart-header">
          <p className="cart-label">YOUR SHOPPING BAG</p>
          <h1>Your Cart</h1>
          <p>
            You have {cartItems.length}{" "}
            {cartItems.length === 1 ? "item" : "items"} in your bag.
          </p>
        </div>

        <div className="cart-layout">
          <section className="cart-items-section">
            <div className="cart-items-heading">
              <h2>Shopping Bag</h2>

              <button
                type="button"
                className="cart-text-button"
                onClick={clearCart}
              >
                Clear cart
              </button>
            </div>

            <div className="cart-items">
              {cartItems.map((item) => (
                <article
                  className="cart-item"
                  key={`${item.id}-${item.size}-${item.color}`}
                >
                  <div className="cart-item-image">
                    {item.image || item.images?.[0] ? (
                      <img
                        src={item.image || item.images[0]}
                        alt={item.name}
                      />
                    ) : (
                      <span>Product Image</span>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <div>
                        <p className="cart-item-category">
                          {item.category}
                        </p>

                        <h3>{item.name}</h3>
                      </div>

                      <p className="cart-item-total">
                        Rs. {calculateItemTotal(item)}
                      </p>
                    </div>

                    <div className="cart-item-options">
                      {item.size && (
                        <p>
                          Size: <strong>{item.size}</strong>
                        </p>
                      )}

                      {item.color && (
                        <p>
                          Color: <strong>{item.color}</strong>
                        </p>
                      )}
                    </div>

                    <p className="cart-item-unit-price">
                      Rs. {item.price} each
                    </p>

                    <div className="cart-item-actions">
                      <div
                        className="cart-quantity"
                        aria-label={`Quantity for ${item.name}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>

                        <span aria-live="polite">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            Number.isFinite(item.availableStock) &&
                            item.quantity >= item.availableStock
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-button"
                        onClick={() =>
                          removeFromCart(
                            item.id,
                            item.size,
                            item.color
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <Link to="/products" className="cart-continue-link">
              <span aria-hidden="true">←</span> Continue shopping
            </Link>
          </section>

          <aside className="cart-summary">
            <p className="cart-label">YOUR ORDER</p>
            <h2>Order Summary</h2>

            <div className="cart-summary-line">
              <span>Items ({cartItems.length})</span>
              <span>Rs. {subtotal}</span>
            </div>

            <div className="cart-summary-line">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <p className="cart-shipping-note">
              Shipping charges, if applicable, will be confirmed
              during checkout.
            </p>

            <div className="cart-summary-total">
              <span>Subtotal</span>
              <strong>Rs. {subtotal}</strong>
            </div>

            <Link
              to="/checkout"
              className="checkout-button cart-primary-button"
            >
              Proceed to Checkout <span aria-hidden="true">→</span>
            </Link>

            <div className="cart-trust-note">
              <span aria-hidden="true">◇</span>
              <p>Thoughtfully selected. Made to be worn.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Cart;
