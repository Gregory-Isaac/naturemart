import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import OAuthButtons, { handleGithubRedirect } from '../components/OAuthButtons';
import FormAlert from '../components/FormAlert';
import useAuthCallback from '../hooks/useAuthCallback';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signup, googleLogin, githubLogin } = useAuth();
  const navigate = useNavigate();
  const { handleGoogleSuccess } = useAuthCallback({ githubLogin, googleLogin, setLoading, setError });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await signup(name, email, password);
    setLoading(false);
    
    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(res.message);
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
          <h2 className="text-3xl font-black mb-2">Join Us</h2>
          <p className="text-gray-400">Create your NatureMart account</p>
        </div>

        <FormAlert message={error} />

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-6 rounded-xl mb-6 text-center">
            <h3 className="font-bold mb-2">Registration Successful!</h3>
            <p className="text-sm opacity-80">You can now sign in. Redirecting...</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50 transition-colors"
                  placeholder="Jane Doe"
                />
              </div>

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
                className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity mt-4"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <OAuthButtons
              onGoogleSuccess={handleGoogleSuccess}
              onGoogleError={() => setError('Google Sign In failed. Please try again.')}
              onGithubClick={handleGithubRedirect}
              loading={loading}
            />
          </>
        )}

        <p className="text-center text-gray-400 text-sm mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-lime-400 hover:text-white transition-colors font-semibold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
