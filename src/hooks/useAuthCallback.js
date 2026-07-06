import { useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function useAuthCallback({ githubLogin, googleLogin, setLoading, setError }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleGithubCallback = useCallback(async (code) => {
    setLoading(true);
    setError('');
    const res = await githubLogin(code);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  }, [githubLogin, setLoading, setError, navigate]);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleGithubCallback(code);
    }
  }, [searchParams, handleGithubCallback]);

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

  return { handleGoogleSuccess };
}
