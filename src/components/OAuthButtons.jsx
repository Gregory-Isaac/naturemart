import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { FiGithub } from 'react-icons/fi';

const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID_HERE';

export function handleGithubRedirect() {
  const redirectUri = window.location.origin + '/login';
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
}

export default function OAuthButtons({ onGoogleSuccess, onGoogleError, onGithubClick, loading }) {
  return (
    <>
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
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            theme="filled_black"
            shape="pill"
            width="100%"
          />
        </div>

        <button
          onClick={onGithubClick}
          disabled={loading}
          className="w-full bg-[#24292e] text-white font-semibold py-2.5 rounded-full flex items-center justify-center gap-3 hover:bg-[#2c3238] transition-colors border border-white/10"
        >
          <FiGithub size={20} />
          <span>Continue with GitHub</span>
        </button>
      </div>
    </>
  );
}
