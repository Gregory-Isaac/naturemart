import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductDetails({ product, closeModal, addToCart }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-6"
    >
      <motion.div className="bg-cardBg backdrop-blur-md p-6 rounded-4xl w-full max-w-4xl relative">
        <button onClick={closeModal} className="absolute top-4 right-4 text-white text-xl">✖</button>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <img src={selectedImage} alt={product.name} className="rounded-3xl w-full object-cover" />
            <div className="flex mt-4 gap-2">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl cursor-pointer ${img === selectedImage ? "ring-2 ring-brandPurple" : ""}`}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 text-white">
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <p className="text-gray-300 mt-2">${product.price}</p>
            <p className="mt-4 text-gray-400">{product.description}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-brandPurple via-brandPink to-brandRed rounded-3xl font-bold hover:opacity-90 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}