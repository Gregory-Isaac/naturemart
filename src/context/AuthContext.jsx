import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, [token]);

  const saveSession = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const authRequest = async (endpoint, payload, fallbackMsg) => {
    try {
      const res = await API.post(endpoint, payload);
      if (res.data.success) {
        saveSession(res.data.token, res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || fallbackMsg };
    }
  };

  const login = (email, password) =>
    authRequest('/signin', { email, password }, 'Login failed');

  const googleLogin = (credential) =>
    authRequest('/google_auth', { credential }, 'Google login failed');

  const githubLogin = (code) =>
    authRequest('/github_auth', { code }, 'GitHub login failed');

  const signup = async (name, email, password) => {
    try {
      const res = await API.post('/signup', { name, email, password });
      return { success: res.data.success, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const devLogin = () => {
    const mockUser = {
      id: 'demo',
      name: 'Premium Member',
      email: 'premium@naturemart.com',
      avatar: 'https://i.pravatar.cc/150?u=premium',
      role: 'premium'
    };
    saveSession('demo-token-123', mockUser);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, token, login, googleLogin, githubLogin, devLogin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
