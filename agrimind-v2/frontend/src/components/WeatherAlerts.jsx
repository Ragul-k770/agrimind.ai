import React, { useEffect, useState } from 'react';
import { Thermometer, Droplets, CloudRain, AlertCircle, RefreshCw } from 'lucide-react';

const WeatherAlerts = ({ isOffline }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://${window.location.hostname}:5000/api/weather`);
      const data = await res.json();
      setWeather(data);
      localStorage.setItem('agrimind_weather', JSON.stringify(data));
      setLoading(false);
    } catch(err) {
      console.error(err);
      // Fallback
      if (isOffline) {
        const cached = localStorage.getItem('agrimind_weather');
        if (cached) setWeather(JSON.parse(cached));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Auto-refresh every 30 mins
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isOffline]);

  if (loading && !weather) {
    return (
      <div className="flex justify-center items-center h-64 text-agrimind-500 animate-pulse">
        <RefreshCw className="animate-spin mr-2" /> Loading local conditions...
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 w-full max-w-5xl mx-auto space-y-6">
      
      <div className="flex justify-between items-end mb-6">
         <div>
           <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Weather Insights</h2>
           <p className="text-gray-400">Current node: New Delhi Farm Location</p>
         </div>
         <button onClick={fetchWeather} disabled={loading} className="text-gray-400 hover:text-white transition-colors bg-black/40 p-2 rounded-lg border border-white/10 glass-card">
           <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
         </button>
      </div>

      {weather?.alert && (
        <div className="glass-card border-red-500/50 bg-red-900/20 p-6 flex flex-col md:flex-row gap-4 items-center animate-fade-in-up">
           <div className="bg-red-500/20 p-3 rounded-full text-red-500 shrink-0">
             <AlertCircle size={32} />
           </div>
           <div>
             <h4 className="text-red-400 font-bold text-lg mb-1">Weather Alert</h4>
             <p className="text-red-200">{weather.alert}</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Temperature Card */}
        <div className="glass-card p-8 bg-gradient-to-br from-black/60 to-black/80 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 text-agrimind-500 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
             <Thermometer size={100} />
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-gray-400 font-medium tracking-wider text-sm uppercase mb-4 flex items-center gap-2"><Thermometer size={16}/> Temperature</span>
            <span className="text-6xl font-bold font-poppins text-white">{weather?.temperature}<span className="text-3xl font-normal text-gray-500">°C</span></span>
            <span className="text-agrimind-500 mt-4 text-sm font-medium bg-agrimind-900/30 px-3 py-1 rounded-full w-max border border-agrimind-500/30">Stable Conditions</span>
          </div>
        </div>

        {/* Rain Card */}
        <div className="glass-card p-8 bg-gradient-to-br from-black/60 to-black/80 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 text-blue-500 group-hover:translate-x-4 transition-transform duration-500">
             <CloudRain size={100} />
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-gray-400 font-medium tracking-wider text-sm uppercase mb-4 flex items-center gap-2"><CloudRain size={16}/> Rain Chance</span>
            <span className="text-6xl font-bold font-poppins text-white">{weather?.rainChance}<span className="text-3xl font-normal text-gray-500">%</span></span>
            <span className="text-blue-400 mt-4 text-sm font-medium bg-blue-900/20 px-3 py-1 rounded-full w-max border border-blue-500/30">{weather?.rainChance > 50 ? "High Risk" : "Low Risk"}</span>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="glass-card p-8 bg-gradient-to-br from-black/60 to-black/80 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 text-cyan-500 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
             <Droplets size={100} />
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-gray-400 font-medium tracking-wider text-sm uppercase mb-4 flex items-center gap-2"><Droplets size={16}/> Humidity</span>
            <span className="text-6xl font-bold font-poppins text-white">{weather?.humidity}<span className="text-3xl font-normal text-gray-500">%</span></span>
            <span className="text-cyan-400 mt-4 text-sm font-medium bg-cyan-900/20 px-3 py-1 rounded-full w-max border border-cyan-500/30">Optimal for crops</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeatherAlerts;
