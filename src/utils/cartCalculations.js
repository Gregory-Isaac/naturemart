const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 15;
const TAX_RATE = 0.08;

export function calculateOrderTotals(cart) {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

export { FREE_SHIPPING_THRESHOLD };
