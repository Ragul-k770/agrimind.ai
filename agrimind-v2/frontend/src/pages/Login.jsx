import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Mail, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate API Login
    localStorage.setItem('agrimind_token', 'dummy_token_123');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex text-white relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-6f23f1141cc3?q=80&w=2070&auto=format')] bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-agrimind-900/90 to-black/95"></div>

      <div className="w-full max-w-md m-auto relative z-10 px-6">
        <div className="glass-card p-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-agrimind-500 to-agrimind-700 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,176,110,0.4)]">
              <Leaf size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold font-poppins text-white">Welcome Back</h2>
            <p className="text-gray-400 mt-2 text-sm text-center">Enter your details to access your farm dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-agrimind-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-500"
                  placeholder="farmer@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-agrimind-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-agrimind-600 to-agrimind-500 rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(34,176,110,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-agrimind-400 hover:text-agrimind-300 font-medium transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
