import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Search } from 'lucide-react';

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('agrimind_token');
    navigate('/login');
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 py-4 mr-4 mt-4 glass-card rounded-2xl mb-4 shadow-xl border-white/5 bg-black/40 backdrop-blur-xl">
      
      {/* Mobile Title */}
      <div className="md:hidden flex items-center font-bold text-xl font-poppins">
        AgriMind <span className="text-agrimind-500 ml-1">AI</span>
      </div>

      {/* Search mock */}
      <div className="hidden md:flex items-center bg-black/40 border border-white/10 rounded-full px-4 py-2 w-1/3">
        <Search size={18} className="text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="Ask AI or search crops..." 
          className="bg-transparent text-sm w-full outline-none text-white placeholder-gray-500"
        />
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={22} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-[#092215] rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-agrimind-600 to-agrimind-400 p-0.5 cursor-pointer shadow-[0_0_15px_rgba(34,176,110,0.5)]">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer" 
              alt="Profile" 
              className="w-full h-full rounded-full bg-black"
            />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-white">Ramesh Patil</p>
            <p className="text-xs text-agrimind-500">Premium Farmer</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="ml-4 p-2 text-red-400 hover:bg-white/5 rounded-xl hover:text-red-300 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
