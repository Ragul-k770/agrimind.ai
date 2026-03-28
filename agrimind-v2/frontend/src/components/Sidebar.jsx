import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Camera, CloudSun, TrendingUp, Settings, Leaf } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'AI Chat', icon: <MessageSquare size={20} />, path: '/dashboard/chat' },
    { name: 'Crop Health', icon: <Camera size={20} />, path: '/dashboard/scan' },
    { name: 'Weather Alerts', icon: <CloudSun size={20} />, path: '/dashboard/weather' },
    { name: 'Market Trends', icon: <TrendingUp size={20} />, path: '/dashboard/market' },
  ];

  return (
    <aside className="w-64 glass-card h-[calc(100vh-2rem)] m-4 hidden md:flex flex-col shadow-2xl overflow-hidden rounded-2xl border-white/5">
      
      {/* Brand */}
      <div className="p-6 flex items-center space-x-3 border-b border-white/5 bg-black/20">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agrimind-500 to-agrimind-700 flex items-center justify-center shadow-lg">
          <Leaf className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold font-poppins text-white tracking-wide shadow-black">AgriMind <span className="text-agrimind-500">AI</span></h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-agrimind-600/90 to-agrimind-800/80 text-white shadow-[0_0_15px_rgba(34,176,110,0.3)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-white/5">
        <button className="flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-gray-400 hover:bg-white/5 hover:text-white transition-all font-medium">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
