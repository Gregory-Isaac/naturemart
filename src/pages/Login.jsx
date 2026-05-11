import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { FiGithub } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  
  const { login, googleLogin, githubLogin, devLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleGithubCallback(code);
    }
  }, [searchParams]);

  const handleGithubCallback = async (code) => {
    setLoading(true);
    setError('');
    const res = await githubLogin(code);
    setLoading(false);
    
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  const handleGithubLogin = () => {
    const clientId = "YOUR_GITHUB_CLIENT_ID_HERE";
    const redirectUri = window.location.origin + "/login";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await login(email, password);
    setLoading(false);
    
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    const res = await googleLogin(credentialResponse.credential);
    setLoading(false);
    
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign In failed. Please try again.');
  };

  const handleDirectLogin = () => {
    const res = devLogin();
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative px-6 py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 glass-panel p-10 rounded-[2rem]"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your NatureMart account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-black font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity mt-4 flex justify-center items-center"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#111] px-4 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="pill"
              width="100%"
            />
          </div>

          <button 
            onClick={handleGithubLogin}
            disabled={loading}
            className="w-full bg-[#24292e] text-white font-semibold py-2.5 rounded-full flex items-center justify-center gap-3 hover:bg-[#2c3238] transition-colors border border-white/10"
          >
            <FiGithub size={20} />
            <span>Continue with GitHub</span>
          </button>

          <button 
            onClick={handleDirectLogin}
            className="w-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 font-semibold py-2.5 rounded-full transition-all border border-white/5"
          >
            Direct Login (Dev Only)
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-lime-400 hover:text-white transition-colors font-semibold">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
