import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

function getSavedCart() {
  try {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1
    );
  } catch (error) {
    console.error("Failed to load cart:", error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getSavedCart);

  useEffect(() => {
    try {
      localStorage.setItem(
        "cart",
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    if (
      !product ||
      typeof product.id !== "string" ||
      typeof product.name !== "string" ||
      typeof product.price !== "number" ||
      !Number.isFinite(product.price) ||
      !Number.isInteger(product.quantity) ||
      product.quantity < 1
    ) {
      console.error(
        "Invalid product data. Product was not added to cart."
      );

      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
            ? {
                ...item,
                quantity:
                  item.quantity + product.quantity,
              }
            : item
        );
      }

      return [...currentItems, product];
    });
  };

  const updateQuantity = (
    productId,
    size,
    color,
    newQuantity
  ) => {
    if (!Number.isInteger(newQuantity)) {
      return;
    }

    if (newQuantity < 1) {
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId &&
        item.size === size &&
        item.color === color
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );
  };

  const removeFromCart = (
    productId,
    size,
    color
  ) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.id === productId &&
            item.size === size &&
            item.color === color
          )
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}