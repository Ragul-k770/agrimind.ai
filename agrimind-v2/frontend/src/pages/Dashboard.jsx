import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ChatUI from '../components/ChatUI';
import CropDetection from '../components/CropDetection';
import WeatherAlerts from '../components/WeatherAlerts';
import MarketChart from '../components/MarketChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Check Auth
    if (!localStorage.getItem('agrimind_token')) {
      navigate('/login');
    }

    // Offline listener for low internet requirement
    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      {/* Background radial gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-agrimind-900/40 via-black to-black object-cover -z-10 pointer-events-none"></div>

      {offline && (
        <div className="absolute top-0 left-0 w-full bg-yellow-600 text-white text-center py-1 text-sm z-50 animate-pulse">
          Offline Mode Active - Using cached data
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <Routes>
            <Route path="chat" element={<ChatUI isOffline={offline} />} />
            <Route path="scan" element={<CropDetection />} />
            <Route path="weather" element={<WeatherAlerts isOffline={offline} />} />
            <Route path="market" element={<MarketChart />} />
            <Route path="" element={<Navigate to="chat" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
