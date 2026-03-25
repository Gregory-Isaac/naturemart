import { useState } from "react";
import Navbar from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import ProductCard from "../components/ProductCard";
import FeaturedCategories from "../components/FeaturedCategories";
import Footer from "../components/Footer";
import CartSidebar from "../components/CartSidebar";
import ProductDetails from "../components/ProductsDetails";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    { id: 1, name: "Organic Apple", price: 3, description: "Fresh organic apples.", images: ["/apple1.jpg","/apple2.jpg"] },
    { id: 2, name: "Wireless Headphones", price: 99, description: "Premium sound quality.", images: ["/headphones1.jpg","/headphones2.jpg"] },
  ];

  const addToCart = (product) => setCartItems([...cartItems, product]);
  const removeFromCart = (id) => setCartItems(cartItems.filter(item => item.id !== id));

  return (
    <div className="bg-black text-white">
      <Navbar />
      <div className="pt-24">
        <HeroCarousel />
        <FeaturedCategories />

        <section className="py-20 px-10">
          <h2 className="text-4xl font-bold mb-10">Featured Products</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {products.map(p => (
              <div key={p.id} onClick={() => setSelectedProduct(p)}>
                <ProductCard {...p} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />

      <CartSidebar
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
      />

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          closeModal={() => setSelectedProduct(null)}
          addToCart={addToCart}
        />
      )}
    </div>
  );
}