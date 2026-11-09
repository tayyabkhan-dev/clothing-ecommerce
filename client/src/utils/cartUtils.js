export function calculateItemTotal(item) {
  if (
    !item ||
    typeof item.price !== "number" ||
    !Number.isFinite(item.price) ||
    !Number.isInteger(item.quantity) ||
    item.quantity < 1
  ) {
    return 0;
  }

  return item.price * item.quantity;
}

export function calculateSubtotal(cartItems) {
  if (!Array.isArray(cartItems)) {
    return 0;
  }

  return cartItems.reduce(
    (total, item) =>
      total + calculateItemTotal(item),
    0
  );
}