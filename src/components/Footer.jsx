import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiInstagram, FiSend } from "react-icons/fi";
import { useNotification } from "./Notification";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { addNotification } = useNotification();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      addNotification("Welcome to the NatureMart community! 🌿", "success");
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-white/5 bg-[#050505] pt-24 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-16 mb-16">
          
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black tracking-tighter mb-6">
              Nature<span className="text-gradient">Mart</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8 font-light">
              Elevating the organic lifestyle with uncompromising quality and sustainable practices. Join us in our journey towards a purer future.
            </p>
            <div className="flex gap-5">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass border border-white/5 text-gray-400 hover:text-white transition-all hover:scale-110"><FiTwitter size={18} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass border border-white/5 text-gray-400 hover:text-white transition-all hover:scale-110"><FiInstagram size={18} /></a>
              <a href="https://github.com/Gregory-Isaac/naturemart" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass border border-white/5 text-gray-400 hover:text-white transition-all hover:scale-110"><FiGithub size={18} /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:col-span-2 gap-12">
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Shop</h3>
              <ul className="space-y-4">
                <li><Link to="/shop" className="text-gray-400 hover:text-white text-sm transition-colors font-light">New Arrivals</Link></li>
                <li><Link to="/shop" className="text-gray-400 hover:text-white text-sm transition-colors font-light">Skincare</Link></li>
                <li><Link to="/shop" className="text-gray-400 hover:text-white text-sm transition-colors font-light">Wellness</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Company</h3>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors font-light">Our Story</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors font-light">Contact</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white text-sm transition-colors font-light">FAQ</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors font-light">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Join Our Newsletter</h3>
            <p className="text-gray-500 text-sm mb-6 font-light">Get the latest organic insights and exclusive offers.</p>
            <form onSubmit={handleSubscribe} className="relative group">
              <input 
                type="email" 
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-16 text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600 shadow-inner"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-xl text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <FiSend size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
          <p>&copy; {new Date().getFullYear()} NatureMart. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
