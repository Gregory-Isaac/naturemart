import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Your Cart</h1>

      {cart.map((item) => (
        <div key={item.id} className="flex justify-between bg-gray-900 p-3 mb-2">
          <p>{item.name}</p>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}