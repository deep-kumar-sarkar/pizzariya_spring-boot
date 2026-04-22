import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmails] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await api.post('/auth/google', { token: credentialResponse.credential });
      const { token, email: userEmail, name } = response.data;
      dispatch(setCredentials({ 
        token, 
        user: { email: userEmail, name } 
      }));
      navigate('/');
    } catch (error) {
      alert('Google Login failed. Please try again.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      // Correctly map the flat response to the nested structure expected by Redux
      const { token, email: userEmail, name } = response.data;
      dispatch(setCredentials({ 
        token, 
        user: { email: userEmail, name } 
      }));
      navigate('/');
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center tracking-tight">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmails(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95"
          >
            Login
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Or</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert('Google Login Failed')}
            useOneTap
            theme="filled_blue"
            shape="pill"
          />
        </div>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Don't have an account? <Link to="/register" className="text-orange-600 font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
