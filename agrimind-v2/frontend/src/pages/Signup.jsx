import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, User, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSignup = (e) => {
    e.preventDefault();
    // Simulate Registration API call
    localStorage.setItem('agrimind_token', 'dummy_token_123');
    navigate('/dashboard');
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  return (
    <div className="min-h-screen flex text-white relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-6f23f1141cc3?q=80&w=2070&auto=format')] bg-cover bg-center opacity-40 filter blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-agrimind-900/95 to-black"></div>

      <div className="w-full max-w-md m-auto relative z-10 px-6">
        <div className="glass-card p-8 md:p-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tl from-agrimind-500 to-agrimind-700 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,176,110,0.4)]">
              <Leaf size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold font-poppins text-white">Create Account</h2>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" name="name" required
                  value={formData.name} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-agrimind-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-agrimind-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-500"
                  placeholder="farmer@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" name="password" required
                  value={formData.password} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-agrimind-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-agrimind-600 to-agrimind-500 rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(34,176,110,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-sm">
            Already registered?{' '}
            <Link to="/login" className="text-agrimind-400 hover:text-agrimind-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
