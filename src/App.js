import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransitions from './components/PageTransitions';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tracking from './pages/Tracking';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Messages from './pages/Messages';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import Chatbot from './components/Chatbot';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransitions><Home /></PageTransitions>} />
            <Route path="/shop" element={<PageTransitions><Shop /></PageTransitions>} />
            <Route path="/login" element={<PageTransitions><Login /></PageTransitions>} />
            <Route path="/signup" element={<PageTransitions><Signup /></PageTransitions>} />
            <Route path="/track" element={<PageTransitions><Tracking /></PageTransitions>} />
            <Route path="/checkout" element={<PageTransitions><Checkout /></PageTransitions>} />
            <Route path="/about" element={<PageTransitions><About /></PageTransitions>} />
            <Route path="/contact" element={<PageTransitions><Contact /></PageTransitions>} />
            <Route path="/privacy" element={<PageTransitions><Privacy /></PageTransitions>} />
            <Route path="/messages" element={<PageTransitions><Messages /></PageTransitions>} />
            <Route path="/wishlist" element={<PageTransitions><Wishlist /></PageTransitions>} />
            <Route path="/profile" element={<PageTransitions><Profile /></PageTransitions>} />
            <Route path="/faq" element={<PageTransitions><FAQ /></PageTransitions>} />
          </Routes>
        </AnimatePresence>
      </main>

      <Chatbot />
      <ScrollToTop />
      <Footer />
    </div>
  );
}

export default App;