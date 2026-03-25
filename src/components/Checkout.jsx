import { useContext } from "react";
import { CartContext } from "../Context/CartContext";
import { Link } from "react-router-dom";

export default function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);

  return (
    <div className="pt-24 px-10 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Checkout</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link to="/products" className="underline text-purple-400">Shop now</Link></p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-cardBg rounded-3xl">
              <span>{item.name}</span>
              <span>${item.price}</span>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="mt-6 w-full py-3 bg-gradient-to-r from-brandPurple via-brandPink to-brandRed rounded-3xl text-white font-bold hover:opacity-90 transition"
          >
            Pay with M-Pesa / Stripe
          </button>
        </div>
      )}
    </div>
  );
}