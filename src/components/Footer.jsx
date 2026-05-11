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
      addNotification("Welcome to the NatureMart community", "success");
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-white/10 bg-[#080807] pt-20 pb-10">
      <div className="premium-shell">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-14 mb-14">
          <div className="lg:col-span-2">
            <span className="premium-kicker mb-4">NatureMart Reserve</span>
            <h2 className="text-3xl font-black tracking-tighter mb-5">
              Nature<span className="text-gradient">Mart</span>
            </h2>
            <p className="premium-muted text-sm leading-7 max-w-sm mb-7">
              Premium natural goods, clean daily rituals, and better essentials for a calmer shelf.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="grid h-11 w-11 place-items-center rounded-md border border-white/10 bg-white/[0.035] text-[var(--nm-muted)] hover:text-white transition-all hover:-translate-y-0.5"><FiTwitter size={18} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-md border border-white/10 bg-white/[0.035] text-[var(--nm-muted)] hover:text-white transition-all hover:-translate-y-0.5"><FiInstagram size={18} /></a>
              <a href="https://github.com/Gregory-Isaac/naturemart" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center rounded-md border border-white/10 bg-white/[0.035] text-[var(--nm-muted)] hover:text-white transition-all hover:-translate-y-0.5"><FiGithub size={18} /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:col-span-2 gap-10">
            <FooterColumn
              title="Shop"
              links={[
                ["New Arrivals", "/shop"],
                ["Skincare", "/shop"],
                ["Wellness", "/shop"],
              ]}
            />
            <FooterColumn
              title="Company"
              links={[
                ["Our Story", "/about"],
                ["Contact", "/contact"],
                ["FAQ", "/faq"],
                ["Privacy Policy", "/privacy"],
              ]}
            />
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Private Notes</h3>
            <p className="premium-muted text-sm mb-5">New drops, calm routines, and exclusive offers.</p>
            <form onSubmit={handleSubscribe} className="relative group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input py-4 px-5 pr-16 placeholder:text-[var(--nm-soft)]"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-2 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-md bg-[var(--nm-ink)] text-black transition-all hover:bg-[var(--nm-green)] active:scale-95"
              >
                <FiSend size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-9 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-5 text-[var(--nm-soft)] text-[10px] uppercase tracking-widest font-bold">
          <p>&copy; {new Date().getFullYear()} NatureMart. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">{title}</h3>
      <ul className="space-y-3">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="premium-muted hover:text-white text-sm transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
