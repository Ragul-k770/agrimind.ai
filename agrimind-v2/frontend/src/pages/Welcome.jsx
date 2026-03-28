import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative bg-black overflow-hidden"
      style={{
        // 4K Anime Farming Background from Unsplash placeholder
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Anime-style particle/glow effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-agrimind-900/90 to-transparent pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl transform transition-transform hover:scale-105 duration-700">
        
        <h1 className="text-6xl md:text-8xl font-bold font-poppins text-white mb-6 tracking-tight drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
          AgriMind <span className="text-agrimind-500">AI</span>
        </h1>
        
        <p className="text-xl md:text-3xl text-gray-200 font-medium mb-12 drop-shadow-lg max-w-2xl font-sans">
          Your Smart Farming Assistant
        </p>

        <button 
          onClick={() => navigate('/login')}
          className="group relative px-8 py-4 bg-gradient-to-r from-agrimind-600 to-agrimind-500 rounded-full font-bold text-lg text-white shadow-[0_0_40px_-10px_rgba(34,176,110,0.8)] hover:shadow-[0_0_60px_-15px_rgba(34,176,110,1)] hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Farming Smart
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          {/* Button highlight effect */}
          <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        </button>

      </div>
    </div>
  );
};

export default Welcome;
