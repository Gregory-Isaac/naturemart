import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend, FiUser, FiSearch, FiPlus,
  FiX, FiMail, FiPhone, FiCalendar, FiMessageSquare,
  FiClock, FiChevronLeft, FiInfo, FiCheck, FiCheckCircle
} from 'react-icons/fi';
import API from '../api/client';
import { useAuth } from '../context/AuthContext';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatMemberSince(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = useCallback(async () => {
    try {
      const res = await API.get('/messages/conversations');
      if (res.data.success) {
        const sorted = (res.data.conversations || []).sort((a, b) => {
          const ta = a.last_message_time || a.created_at || '';
          const tb = b.last_message_time || b.created_at || '';
          return tb.localeCompare(ta);
        });
        setConversations(sorted);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (otherId) => {
    try {
      const res = await API.get(`/messages/get/${otherId}`);
      if (res.data.success) setMessages(res.data.messages);
    } catch { /* silently fail */ }
  }, []);

  const fetchUserDetail = async (userId) => {
    setDetailLoading(true);
    try {
      const res = await API.get(`/users/${userId}`);
      if (res.data.success) setUserDetail(res.data.user);
    } catch { /* silently fail */ }
    setDetailLoading(false);
  };

  const fetchAllUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await API.get('/users');
      if (res.data.success) setAllUsers(res.data.users || []);
    } catch { /* silently fail */ }
    setUsersLoading(false);
  };

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    if (!selectedConvo) return;
    fetchMessages(selectedConvo.id);
    const interval = setInterval(() => {
      fetchMessages(selectedConvo.id);
      fetchConversations();
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedConvo, fetchMessages, fetchConversations]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvo) return;
    const text = newMessage;
    setNewMessage('');
    setMessages(prev => [...prev, {
      sender_id: user.id,
      message: text,
      createdAt: new Date().toISOString()
    }]);
    try {
      await API.post('/messages/send', {
        receiver_id: selectedConvo.id,
        message: text
      });
      fetchConversations();
    } catch { /* silently fail */ }
  };

  const startConversation = (u) => {
    setSelectedConvo(u);
    setShowNewChat(false);
    setMobileView('chat');
    fetchMessages(u.id);
  };

  const handleSelectConvo = (convo) => {
    setSelectedConvo(convo);
    setShowUserDetail(false);
    setMobileView('chat');
  };

  const handleBackToList = () => {
    setMobileView('list');
    setSelectedConvo(null);
    setShowUserDetail(false);
  };

  const handleShowDetail = () => {
    if (!selectedConvo) return;
    setShowUserDetail(true);
    fetchUserDetail(selectedConvo.id);
  };

  const filteredConversations = conversations.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const existingIds = new Set(conversations.map(c => c.id));

  if (!user) {
    return (
      <div className="premium-page min-h-[80vh] flex items-center justify-center px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="premium-card premium-veil max-w-xl p-10">
          <div className="relative z-10">
            <div className="mx-auto mb-8 grid h-24 w-24 place-items-center rounded-lg border border-white/10 bg-white/5 text-[var(--nm-gold)]">
              <FiMessageSquare size={40} />
            </div>
            <h2 className="premium-heading text-4xl md:text-5xl mb-5">Private Messages</h2>
            <p className="premium-muted mb-9">Log in to view and send private messages to other NatureMart members.</p>
            <a href="/login" className="premium-button premium-button-primary">
              <FiUser />
              Sign In
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto h-[82vh] glass-panel rounded-[2rem] overflow-hidden flex border border-white/5 shadow-2xl">

        {/* Sidebar */}
        <div className={`${mobileView === 'list' ? 'flex' : 'hidden'} md:flex w-full md:w-80 lg:w-96 border-r border-white/5 flex-col bg-black/20`}>
          {/* Header */}
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black tracking-tight text-white">Messages</h2>
              <button
                onClick={() => { setShowNewChat(true); fetchAllUsers(); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-black hover:scale-105 active:scale-95 transition-all shadow-lg"
                title="New conversation"
              >
                <FiPlus size={18} />
              </button>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <div className="p-10 text-center text-gray-500 text-sm">Loading chats...</div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => handleSelectConvo(convo)}
                  className={`w-full p-4 flex items-center gap-3 transition-all hover:bg-white/5 group ${
                    selectedConvo?.id === convo.id ? 'bg-white/10 border-l-4 border-emerald-500' : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500/20 to-lime-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/10 font-bold text-sm">
                      {convo.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    {convo.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-[10px] font-bold text-black flex items-center justify-center shadow-lg">
                        {convo.unread_count > 9 ? '9+' : convo.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="text-left flex-grow overflow-hidden min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`font-bold truncate text-sm ${convo.unread_count > 0 ? 'text-white' : 'text-gray-300'}`}>
                        {convo.name}
                      </h4>
                      <span className="text-[10px] text-gray-600 flex-shrink-0">
                        {timeAgo(convo.last_message_time)}
                      </span>
                    </div>
                    {convo.last_message && (
                      <p className={`text-xs truncate mt-0.5 ${convo.unread_count > 0 ? 'text-gray-300 font-medium' : 'text-gray-600'}`}>
                        {convo.last_message_sender === user.id ? (
                          <span className="text-gray-500">You: </span>
                        ) : null}
                        {convo.last_message}
                      </p>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-700 mb-4 mx-auto">
                  <FiMessageSquare size={28} />
                </div>
                <p className="text-gray-500 text-sm font-light">No conversations yet.</p>
                <button
                  onClick={() => { setShowNewChat(true); fetchAllUsers(); }}
                  className="mt-4 text-xs text-emerald-500 hover:text-emerald-400 transition-colors font-medium"
                >
                  Start a new chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat + Detail Panel */}
        <div className={`${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex flex-grow flex-col bg-black/10 relative`}>
          {selectedConvo ? (
            <>
              {/* Chat Header */}
              <div className="p-4 md:p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToList}
                    className="md:hidden p-2 text-gray-400 hover:text-white transition-colors -ml-2"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center text-black font-bold text-sm">
                    {selectedConvo.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{selectedConvo.name}</h3>
                    <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Active
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleShowDetail}
                  className={`p-2 transition-colors rounded-lg ${showUserDetail ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  title="View user details"
                >
                  <FiInfo size={18} />
                </button>
              </div>

              {/* Content Area (Messages + optional Detail Panel) */}
              <div className="flex-grow flex overflow-hidden">
                {/* Messages */}
                <div className={`flex-grow flex flex-col ${showUserDetail ? 'hidden lg:flex' : 'flex'}`}>
                  <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-3">
                    {messages.length === 0 && (
                      <div className="flex-grow flex items-center justify-center text-center py-20">
                        <div>
                          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-700 mb-3 mx-auto">
                            <FiSend size={24} />
                          </div>
                          <p className="text-gray-500 text-sm">No messages yet. Say hello!</p>
                        </div>
                      </div>
                    )}
                    {messages.map((msg, idx) => {
                      const isMine = msg.sender_id === user.id;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15 }}
                          className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isMine && (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500/20 to-lime-500/20 flex items-center justify-center text-emerald-400 text-[10px] font-bold mr-2 flex-shrink-0 mt-1">
                              {selectedConvo.name?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <div className={`max-w-[70%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed ${
                            isMine
                              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-tr-sm'
                              : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-sm'
                          }`}>
                            <p className="break-words">{msg.message}</p>
                            <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : ''}`}>
                              <span className="text-[9px] opacity-50">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMine && (
                                <FiCheck size={10} className="opacity-50" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSendMessage} className="p-4 md:p-5 bg-black/20 border-t border-white/5">
                    <div className="relative flex items-center gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Write a message..."
                        className="flex-grow bg-white/5 border border-white/10 rounded-2xl py-3 px-5 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-xl text-black shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 flex-shrink-0"
                      >
                        <FiSend size={18} />
                      </button>
                    </div>
                  </form>
                </div>

                {/* User Detail Panel */}
                <AnimatePresence>
                  {showUserDetail && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 320, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-l border-white/5 bg-black/20 overflow-hidden flex-shrink-0 flex flex-col"
                    >
                      <div className="p-5 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">User Details</h3>
                        <button onClick={() => setShowUserDetail(false)} className="p-1 text-gray-500 hover:text-white transition-colors">
                          <FiX size={16} />
                        </button>
                      </div>

                      {detailLoading ? (
                        <div className="flex-grow flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : userDetail ? (
                        <div className="flex-grow overflow-y-auto p-5">
                          {/* Avatar + Name */}
                          <div className="text-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center text-black font-black text-2xl mx-auto mb-4 shadow-xl">
                              {userDetail.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <h4 className="text-lg font-bold text-white">{userDetail.name}</h4>
                            <span className="text-xs text-emerald-500 font-medium flex items-center justify-center gap-1 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                              NatureMart Member
                            </span>
                          </div>

                          {/* Info Cards */}
                          <div className="space-y-3">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="flex items-center gap-3 mb-1">
                                <FiMail size={14} className="text-emerald-400" />
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Email</span>
                              </div>
                              <p className="text-sm text-white pl-7 break-all">{userDetail.email}</p>
                            </div>

                            {userDetail.phone && (
                              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="flex items-center gap-3 mb-1">
                                  <FiPhone size={14} className="text-emerald-400" />
                                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Phone</span>
                                </div>
                                <p className="text-sm text-white pl-7">{userDetail.phone}</p>
                              </div>
                            )}

                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="flex items-center gap-3 mb-1">
                                <FiCalendar size={14} className="text-emerald-400" />
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Member Since</span>
                              </div>
                              <p className="text-sm text-white pl-7">{formatMemberSince(userDetail.created_at)}</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="flex items-center gap-3 mb-1">
                                <FiMessageSquare size={14} className="text-emerald-400" />
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Messages Exchanged</span>
                              </div>
                              <p className="text-sm text-white pl-7 font-bold">{userDetail.message_count || 0}</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="flex items-center gap-3 mb-1">
                                <FiClock size={14} className="text-emerald-400" />
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Last Active</span>
                              </div>
                              <p className="text-sm text-white pl-7">{formatMemberSince(userDetail.last_active)}</p>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="mt-6 space-y-2">
                            <button
                              onClick={() => setShowUserDetail(false)}
                              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-lime-500 text-black font-bold rounded-xl text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                            >
                              <FiSend size={14} className="inline mr-2" />
                              Send Message
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-grow flex items-center justify-center text-gray-600 text-sm">
                          Could not load user details
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-10">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-gray-700 mb-6">
                <FiSend size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">Select a Conversation</h3>
              <p className="text-gray-600 text-sm max-w-xs font-light mb-6">
                Choose a contact from the left to start chatting, or start a new conversation.
              </p>
              <button
                onClick={() => { setShowNewChat(true); fetchAllUsers(); }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-lime-500 text-black font-bold rounded-xl text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <FiPlus size={14} className="inline mr-2" />
                New Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      <AnimatePresence>
        {showNewChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewChat(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0f0a] border border-white/10 rounded-2xl w-full max-w-md max-h-[70vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">New Conversation</h3>
                <button onClick={() => setShowNewChat(false)} className="p-1 text-gray-500 hover:text-white transition-colors">
                  <FiX size={18} />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-white/5">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
                    autoFocus
                  />
                </div>
              </div>

              {/* User List */}
              <div className="overflow-y-auto max-h-[45vh]">
                {usersLoading ? (
                  <div className="p-10 text-center">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => startConversation(u)}
                      className="w-full p-4 flex items-center gap-3 transition-all hover:bg-white/5 border-b border-white/[0.03] last:border-b-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500/20 to-lime-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/10 font-bold text-sm flex-shrink-0">
                        {u.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="text-left flex-grow overflow-hidden">
                        <h4 className="text-white font-bold text-sm truncate">{u.name}</h4>
                        <p className="text-gray-500 text-xs truncate">{u.email}</p>
                      </div>
                      {existingIds.has(u.id) ? (
                        <span className="flex-shrink-0 text-[10px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1">
                          <FiCheckCircle size={12} />
                          Active
                        </span>
                      ) : (
                        <span className="flex-shrink-0 text-[10px] text-gray-600 uppercase tracking-wider">New</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-10 text-center text-gray-500 text-sm">
                    {userSearch ? 'No users found' : 'No other users registered yet'}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
