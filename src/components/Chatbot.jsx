import React   ,                       { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiAward,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiMessageCircle,
  FiMinimize2,
  FiPackage,
  FiSend,
  FiShield,
  FiShoppingBag,
  FiX,
  FiZap,
} from "react-icons/fi";
import API from "../api/client";

const starterPrompts = [
  "Build me a glow routine",
  "Recommend a premium gift",
  "Help me choose skincare",
  "Track my order",
];

const conciergeSignals = [
  { icon: <FiShoppingBag />, label: "Products" },
  { icon: <FiPackage />, label: "Orders" },
  { icon: <FiShield />, label: "Ingredients" },
];

const welcomeMessage = {
  text  : "Welcome to NatureMart Reserve. I can help with product picks, gifts, order support, or a cleaner daily routine.",
  sender: "bot",
};

const Chatbot = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState([welcomeMessage]);
  const [input, setInput]         = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef            = useRef(null);
  const inputRef                  = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 240);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sendMessage = async (messageText) => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    setMessages((prev) => [...prev, { text: trimmedMessage, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    try {
      const { data } = await API.post("/chat", { message: trimmedMessage });

      setMessages((prev) => [
        ...prev,
        {
          text: data?.success
            ? data.response
                :    "I could not reach the concierge service right now. Please try again in a moment.",
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text  : "The concierge line is temporarily unavailable. You can still browse products or try again shortly.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className = "fixed bottom-4 left-4 right-4 z-[9999] font-sans sm:bottom-6 sm:left-auto sm:right-6">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial    = {{ opacity: 0, scale: 0.94, y: 24 }}
            animate    = {{ opacity: 1, scale: 1, y: 0 }}
            exit       = {{ opacity: 0, scale: 0.94, y: 24 }}
            transition = {{ duration: 0.24, ease: "easeOut" }}
            className  = "ml-auto flex h-[min(680px,calc(100vh-2rem))] w-full flex-col overflow-hidden rounded-lg border border-[var(--nm-line)] bg-[#090907]/95 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:w-[430px]"
          >
            <div     className = "relative overflow-hidden border-b border-[var(--nm-line)] bg-[linear-gradient(135deg,rgba(216,180,95,0.16),rgba(53,208,127,0.07)_45%,rgba(255,255,255,0.04))]">
            <div     className = "absolute inset-0 bg-[linear-gradient(90deg,rgba(247,244,237,0.08)_1px,transparent_1px),linear-gradient(rgba(247,244,237,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-25" />
            <div     className = "relative p-4">
            <div     className = "flex items-start justify-between gap-4">
            <div     className = "flex items-center gap-3">
            <div     className = "grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-[rgba(216,180,95,0.32)] bg-black/35 text-[var(--nm-gold)] shadow-lg shadow-black/25">
            <FiAward size      = {22} />
                    </div>
                    <div>
                      <p className = "text-[10px] font-black uppercase tracking-[0.18em] text-[var(--nm-gold)]">
                        NatureMart Reserve
                      </p>
                      <h3 className = "mt-1 text-base font-black leading-tight text-[var(--nm-ink)]">
                        Concierge Chat
                      </h3>
                      <div  className = "mt-2 flex items-center gap-2">
                      <span className = "h-2 w-2 rounded-full bg-[var(--nm-green)] shadow-[0_0_18px_rgba(53,208,127,0.8)]" />
                      <span className = "text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nm-muted)]">
                          Online support
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className = "flex items-center gap-1">
                    <button
                      type       = "button"
                      onClick    = {() => setIsOpen(false)}
                      className  = "grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-[var(--nm-muted)] transition-colors hover:text-[var(--nm-ink)]"
                      aria-label = "Minimize concierge chat"
                    >
                      <FiMinimize2 size = {17} />
                    </button>
                    <button
                      type       = "button"
                      onClick    = {() => setIsOpen(false)}
                      className  = "grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-[var(--nm-muted)] transition-colors hover:text-[var(--nm-ink)]"
                      aria-label = "Close concierge chat"
                    >
                      <FiX size = {17} />
                    </button>
                  </div>
                </div>

                <div className = "mt-4 grid grid-cols-3 gap-2">
                  {conciergeSignals.map((signal) => (
                    <div
                      key       = {signal.label}
                      className = "flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-black/25 px-2 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--nm-muted)]"
                    >
                      <span className = "text-[var(--nm-gold)]">{signal.icon}</span>
                      <span className = "truncate">{signal.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className = "flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] p-4">
            <div className = "space-y-4">
                {messages.map((msg, index) => {
                  const isUser = msg.sender === "user";

                  return (
                    <motion.div
                      key       = {`${msg.sender}-${index}-${msg.text.slice(0, 12)}`}
                      initial   = {{ opacity: 0, y: 10 }}
                      animate   = {{ opacity: 1, y: 0 }}
                      className = {`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
                        <div       className = "mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-md border border-[rgba(216,180,95,0.24)] bg-[rgba(216,180,95,0.08)] text-[var(--nm-gold)]">
                        <FiCompass size      = {16} />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow-lg ${
                          isUser
                            ? "bg-[var(--nm-ink)] text-[#080807] shadow-black/20"
                            :    "border border-white/10 bg-white/[0.055] text-[var(--nm-ink)] shadow-black/15"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                })}

                {messages.length === 1 && (
                  <motion.div
                    initial   = {{ opacity: 0, y: 8 }}
                    animate   = {{ opacity: 1, y: 0 }}
                    className = "rounded-lg border border-white/10 bg-black/25 p-3"
                  >
                    <div className = "mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--nm-gold)]">
                      <FiZap />
                      Quick requests
                    </div>
                    <div className = "grid gap-2">
                      {starterPrompts.map((prompt) => (
                        <button
                          key       = {prompt}
                          type      = "button"
                          onClick   = {() => sendMessage(prompt)}
                          disabled  = {isLoading}
                          className = "flex min-h-10 items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 text-left text-xs font-bold text-[var(--nm-ink)] transition-colors hover:border-[rgba(216,180,95,0.42)] hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <span>{prompt}</span>
                          <FiSend className = "shrink-0 text-[var(--nm-gold)]" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {isLoading && (
                  <motion.div
                    initial   = {{ opacity: 0, y: 8 }}
                    animate   = {{ opacity: 1, y: 0 }}
                    className = "flex items-center gap-3"
                  >
                    <div     className = "grid h-8 w-8 shrink-0 place-items-center rounded-md border border-[rgba(216,180,95,0.24)] bg-[rgba(216,180,95,0.08)] text-[var(--nm-gold)]">
                    <FiClock size      = {16} />
                    </div>
                    <div className = "rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3">
                    <div className = "flex gap-1.5">
                        {[0, 1, 2].map((dot) => (
                          <span
                            key       = {dot}
                            className = "h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--nm-muted)]"
                            style     = {{ animationDelay: `${dot * 140}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref = {messagesEndRef} />
              </div>
            </div>

            <form          onSubmit  = {handleSend} className = "border-t border-[var(--nm-line)] bg-black/45 p-4">
            <div           className = "mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nm-muted)]">
            <FiCheckCircle className = "text-[var(--nm-green)]" />
                Premium product guidance
              </div>
              <div className = "flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] p-1.5 focus-within:border-[rgba(53,208,127,0.58)] focus-within:bg-white/[0.065]">
                <input
                  ref         = {inputRef}
                  type        = "text"
                  value       = {input}
                  onChange    = {(event) => setInput(event.target.value)}
                  placeholder = "Ask the concierge..."
                  className   = "min-h-11 flex-1 bg-transparent px-3 text-sm text-[var(--nm-ink)] outline-none placeholder:text-[var(--nm-soft)]"
                />
                <button
                  type       = "submit"
                  disabled   = {!input.trim() || isLoading}
                  className  = "grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[var(--nm-ink)] text-[#080807] transition hover:bg-[var(--nm-green)] disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label = "Send message"
                >
                  <FiSend size = {18} />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button
            key        = "fab"
            initial    = {{ opacity: 0, scale: 0.82, y: 16 }}
            animate    = {{ opacity: 1, scale: 1, y: 0 }}
            exit       = {{ opacity: 0, scale: 0.82, y: 16 }}
            whileHover = {{ y: -3 }}
            whileTap   = {{ scale: 0.96 }}
            type       = "button"
            onClick    = {() => setIsOpen(true)}
            className  = "group ml-auto flex h-16 w-16 items-center justify-center rounded-lg border border-[rgba(216,180,95,0.38)] bg-[#090907]/92 text-[var(--nm-ink)] shadow-2xl shadow-black/45 backdrop-blur-2xl transition-colors hover:border-[rgba(53,208,127,0.52)] sm:h-[72px] sm:w-[72px]"
            aria-label = "Open NatureMart concierge chat"
          >
            <span            className = "absolute inset-1 rounded-md border border-white/10" />
            <FiMessageCircle size      = {28} className = "relative z-10 transition-colors group-hover:text-[var(--nm-green)]" />
            <span            className = "absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-md border border-[#090907] bg-[var(--nm-gold)] px-1 text-[10px] font-black text-[#080807]">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
