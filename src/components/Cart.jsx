import { useContext } from "react";
import { CartContext } from "../Context/CartContext";

function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="container mt-4">
      <h3>🛒 Cart</h3>

      {cart.map(item => (
        <div className="card p-3 mb-3" key={item.id}>
          <h5>{item.name}</h5>
          <p>KES {item.price}</p>

          <div className="d-flex gap-2">
            <button onClick={() => decreaseQty(item.id)}>-</button>
            <span>{item.qty}</span>
            <button onClick={() => increaseQty(item.id)}>+</button>
          </div>

          <button className="btn btn-danger mt-2" onClick={() => removeFromCart(item.id)}>
            Remove
          </button>
        </div>
      ))}

      <h4>Total: KES {total}</h4>
    </div>
  );
}

export default Cart;