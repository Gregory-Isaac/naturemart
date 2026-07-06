import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiSearch, FiMoreVertical } from 'react-icons/fi';
import API from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConvo) {
      fetchMessages(selectedConvo.id);
      const interval = setInterval(() => fetchMessages(selectedConvo.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConvo]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await API.get('/messages/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);
        setError("");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conversations", error);
      setError("Could not load your conversations. Please try again.");
      setLoading(false);
    }
  };

  const fetchMessages = async (otherId) => {
    try {
      const res = await API.get(`/messages/get/${otherId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
        setError("");
      }
    } catch (error) {
      console.error("Error fetching messages", error);
      setError("Could not load this conversation. Please try again.");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvo) return;

    try {
      const res = await API.post('/messages/send', {
        receiver_id: selectedConvo.id,
        message: newMessage
      });
      if (res.data.success) {
        setMessages([...messages, { 
          sender_id: user.id, 
          message: newMessage, 
          createdAt: new Date().toISOString() 
        }]);
        setNewMessage("");
        setError("");
      } else {
        setError(res.data.message || "Message could not be sent.");
      }
    } catch (error) {
      console.error("Error sending message", error);
      setError("Message failed to send. Please check your connection and try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Please log in to view your private messages.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-6">
      {error && (
        <div className="max-w-7xl mx-auto mb-4 flex items-center justify-between gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-300">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-300/70 hover:text-white transition-colors text-xs uppercase tracking-widest">Dismiss</button>
        </div>
      )}
      <div className="max-w-7xl mx-auto h-[80vh] glass-panel rounded-[2.5rem] overflow-hidden flex border border-white/5 shadow-2xl">
        
        {/* Sidebar - Conversations */}
        <div className="w-full md:w-80 lg:w-96 border-r border-white/5 flex flex-col bg-black/20">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-2xl font-black tracking-tighter mb-4 text-white">Messages</h2>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search chats..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <div className="p-10 text-center text-gray-500 text-sm">Loading chats...</div>
            ) : conversations.length > 0 ? (
              conversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => setSelectedConvo(convo)}
                  className={`w-full p-4 flex items-center gap-4 transition-all hover:bg-white/5 ${selectedConvo?.id === convo.id ? 'bg-white/10 border-l-4 border-emerald-500' : ''}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500/20 to-lime-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/10">
                    <FiUser size={24} />
                  </div>
                  <div className="text-left flex-grow overflow-hidden">
                    <h4 className="text-white font-bold truncate">{convo.name}</h4>
                    <p className="text-gray-500 text-xs truncate">{convo.email}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-10 text-center">
                <p className="text-gray-500 text-sm font-light">No conversations yet.</p>
                <p className="text-gray-600 text-[10px] mt-2 uppercase tracking-widest">Start a chat from a product page or vendor profile!</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-grow flex flex-col bg-black/10">
          {selectedConvo ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center text-black font-bold">
                    {selectedConvo.name[0]}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{selectedConvo.name}</h3>
                    <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest">Active Now</span>
                  </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                  <FiMoreVertical size={20} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                      msg.sender_id === user.id 
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'
                    }`}>
                      <p>{msg.message}</p>
                      <span className="text-[9px] opacity-50 mt-1 block">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-6 bg-black/20 border-t border-white/5">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a message..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-16 text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600 shadow-inner"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 p-3 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-xl text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <FiSend size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-10">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-700 mb-6">
                <FiSend size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">Select a Conversation</h3>
              <p className="text-gray-600 text-sm max-w-xs font-light">Choose a contact from the left to start chatting privately with vendors or other users.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
