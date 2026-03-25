import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Wishlist() {
  const { wishlist, addToCart } = useContext(CartContext);

  return (
    <div className="container mt-4">
      <h3>❤️ Wishlist</h3>

      {wishlist.map(item => (
        <div className="card p-3 mb-2" key={item.id}>
          <h5>{item.name}</h5>
          <p>KES {item.price}</p>

          <button className="btn btn-warning" onClick={() => addToCart(item)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default Wishlist;