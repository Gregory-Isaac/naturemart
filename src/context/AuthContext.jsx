import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      // In a real app we would fetch the user profile from the backend
      // For now we trust the token in localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Failed to parse saved user; clearing corrupted session', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await API.post('/signin', { email, password });
      if (res.data.success) {
        const newToken = res.data.token;
        const userData = res.data.user;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const res = await API.post('/google_auth', { credential });
      if (res.data.success) {
        const newToken = res.data.token;
        const userData = res.data.user;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Google login failed' };
    }
  };

  const githubLogin = async (code) => {
    try {
      const res = await API.post('/github_auth', { code });
      if (res.data.success) {
        const newToken = res.data.token;
        const userData = res.data.user;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'GitHub login failed' };
    }
  };

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
    const mockToken = 'demo-token-123';
    setToken(mockToken);
    setUser(mockUser);
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, token, login, googleLogin, githubLogin, devLogin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
