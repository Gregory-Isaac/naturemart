import { motion } from "framer-motion";
import { products } from "../data/products";
const ProductCard = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }} // Lifts the card up on hover
      whileTap={{ scale: 0.95 }} // Shrinks slightly when clicked
      className="product-card"
    >
      <img src={product.image} />
      {/* ... rest of card */}
      <motion.button 
        whileHover={{ backgroundColor: "#2d5a27" }} // Change green shade smoothly
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </motion.button>
    </motion.div>
  );
};