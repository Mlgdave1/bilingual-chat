import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { signUpUser, signInUser } from '../utils/auth';
import { useEffect } from 'react';

export default function Auth() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = isSignUp 
        ? await signUpUser(email, password, username)
        : await signInUser(email, password);

      if (result.error) {
        setError(result.error);
        return;
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="text-accent-400" size={32} />
            <h1 className="text-2xl font-bold text-gray-100">BilingualChat</h1>
          </div>
          <p className="text-gray-400">Connect across languages with instant translations</p>
        </div>

        <div className="bg-dark-200 p-8 rounded-lg border border-dark-300">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-center rounded-lg transition-colors ${
                !isSignUp 
                  ? 'bg-accent-600 text-white' 
                  : 'bg-dark-300 text-gray-400 hover:bg-dark-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-center rounded-lg transition-colors ${
                isSignUp 
                  ? 'bg-accent-600 text-white' 
                  : 'bg-dark-300 text-gray-400 hover:bg-dark-400'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-gray-100 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-gray-100 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-gray-100 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border-l-4 border-red-500 text-red-400 text-sm rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isSignUp ? 'Signing up...' : 'Signing in...'}
                </span>
              ) : (
                <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}