import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import OAuthButtons, { handleGithubRedirect } from '../components/OAuthButtons';
import FormAlert from '../components/FormAlert';
import useAuthCallback from '../hooks/useAuthCallback';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleLogin, githubLogin, devLogin } = useAuth();
  const navigate = useNavigate();
  const { handleGoogleSuccess } = useAuthCallback({ githubLogin, googleLogin, setLoading, setError });

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

        <FormAlert message={error} />

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

        <OAuthButtons
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={() => setError('Google Sign In failed. Please try again.')}
          onGithubClick={handleGithubRedirect}
          loading={loading}
        />

        <div className="mt-4">
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
