import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Getproducts from './components/Getproducts';
import Addproducts from './components/Addproducts'; 
import Signup from './components/Signup';
import Signin from './components/Signin';
import Makepayment from './components/Makepayments';
import Loader from './components/Loader';
import Notfound from './components/Notfound'; 
import Cart from './components/Cart';
import Mycarousel from './components/Mycarousel';
import Home from './components/Home';
import Checkout from './components/Checkout';

import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import Sidebar from './components/Sidebar';
import HeroCarousel from './components/HeroCarousel';
import ProductCard from './components/ProductCard';
import ProductDetaills from './components/ProductsDetails';
import FeaturedCategories from './components/FeaturedCategories';


function App() {
  return (
    <Router>
      {/* 🔥 NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-2">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Brand / Logo */}
        <div className="text-center py-4 bg-light">
         <h1 className="fw-bold display-4">
           Welcome to <span className="text-success">Nature</span>
           <span className="text-warning">Mart</span> 🌿
          </h1>
           <p className="text-muted">
            Fresh groceries, organic foods, and unbeatable prices delivered to your door
          </p>
         </div>

          {/* Search Bar */}
          <form className="d-flex flex-grow-1 mx-4">
            <input className="form-control me-2" type="search" placeholder="Search for products..." />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>

          {/* Nav Links */}
          <ul className="navbar-nav d-flex flex-row gap-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/addproducts">Add Product</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart 🛒</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signin">Sign In</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">Sign Up</Link>
            </li>
            <li className="nav-item">
               <Link className= "nav-link" to="/Makepayment">Makepayment</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* 🔥 PROMO BANNER */}
      <div className="bg-dark text-white text-center p-2">
        🔥 Big Sale! Up to 50% OFF on all products!
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="container md-6 mt-4">
        <Routes>
          <Route path="/products" element={<Getproducts />} />
          <Route path="/addproducts" element={<Addproducts />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/makepayment" element={<Makepayment />} />
          <Route path="/loader" element={<Loader />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<Notfound />} />
          <Route path="/" element={<Home />} />
          <Route path="/Mycarousel" element={<Mycarousel />} />
          <Route path="/App" element={<App />} />
          
          
        </Routes>
      </div>

      {/* 🔥 FOOTER */}
      <footer className="bg-dark text-white text-center p-4 mt-5">
        <p>© 2026 NatureMart 🌿 | All Rights Reserved</p>
        <p>Follow us: Facebook | Instagram | Twitter</p>
      </footer>
    </Router>
  );
}

export default App;