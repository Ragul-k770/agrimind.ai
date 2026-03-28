import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, MapPin, Map } from 'lucide-react';

const MarketChart = () => {
  const [regionsData, setRegionsData] = useState({});
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available regions on mount
  useEffect(() => {
    fetch(`http://${window.location.hostname}:5000/api/market/regions`)
      .then(res => res.json())
      .then(data => {
        setRegionsData(data);
        const states = Object.keys(data);
        if (states.length > 0) {
          setSelectedState(states[0]); // Default to first state
          setSelectedDistrict(data[states[0]][0] || ''); // Default to first district
        }
      })
      .catch(err => console.error("Regions fetch failed", err));
  }, []);

  // Fetch market trends when region changes
  useEffect(() => {
    if (!selectedState) return;

    setLoading(true);
    const query = new URLSearchParams({ state: selectedState });
    if (selectedDistrict) query.append('district', selectedDistrict);

    fetch(`http://${window.location.hostname}:5000/api/market?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        setTrends(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Market fetch failed", err);
        setLoading(false);
      });
  }, [selectedState, selectedDistrict]);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const districts = regionsData[newState] || [];
    setSelectedDistrict(districts.length > 0 ? districts[0] : '');
  };

  return (
    <div className="p-2 md:p-6 w-full max-w-5xl mx-auto space-y-6">
       
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
           <div>
             <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Market Analytics</h2>
             <p className="text-gray-400">Live prices from mandated APMC markets in India</p>
           </div>
           
           {/* Filters */}
           <div className="flex bg-black/40 glass-card rounded-2xl p-2 gap-2 border border-white/10 shadow-xl">
             <div className="relative">
               <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-agrimind-500">
                 <Map size={16} />
               </div>
               <select 
                 value={selectedState} 
                 onChange={handleStateChange}
                 className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-10 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-agrimind-500 hover:bg-white/10 transition-colors"
               >
                 {Object.keys(regionsData).map(state => (
                   <option key={state} value={state} className="bg-black text-white">{state}</option>
                 ))}
               </select>
             </div>

             <div className="relative border-l border-white/10 pl-2">
               <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-agrimind-500">
                 <MapPin size={16} />
               </div>
               <select 
                 value={selectedDistrict} 
                 onChange={(e) => setSelectedDistrict(e.target.value)}
                 className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-10 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-agrimind-500 hover:bg-white/10 transition-colors"
                 disabled={!selectedState || !regionsData[selectedState]}
               >
                 <option value="" className="bg-black text-white">All Districts</option>
                 {(regionsData[selectedState] || []).map(district => (
                   <option key={district} value={district} className="bg-black text-white">{district}</option>
                 ))}
               </select>
             </div>
           </div>
       </div>

       <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border-white/5">
         
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-black/60 text-gray-400 border-b border-white/5 text-sm uppercase tracking-wider font-semibold">
                 <th className="p-6">Crop Name</th>
                 <th className="p-6 text-right">Current Price (₹/Quintal)</th>
                 <th className="p-6 text-right">Trend vs Yesterday</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5 bg-black/20 relative">
               {loading ? (
                 <tr>
                   <td colSpan="3" className="p-16 text-center">
                     <div className="flex flex-col items-center justify-center space-y-3">
                       <div className="w-8 h-8 rounded-full border-2 border-agrimind-500 border-t-transparent animate-spin"></div>
                       <p className="text-agrimind-500 tracking-wider">Fetching live data for {selectedDistrict ? `${selectedDistrict}, ` : ''}{selectedState}...</p>
                     </div>
                   </td>
                 </tr>
               ) : trends.length === 0 ? (
                 <tr>
                   <td colSpan="3" className="p-8 text-center text-gray-400">No data available for this region.</td>
                 </tr>
               ) : trends.map((item, index) => (
                 <tr key={index} className="hover:bg-white-[0.02] transition-colors group">
                   <td className="p-6 font-medium text-white text-lg flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-agrimind-500"></div>
                     {item.crop}
                   </td>
                   <td className="p-6 text-right text-gray-200 font-mono text-lg font-bold">
                     ₹{item.currentPrice.toLocaleString()}
                   </td>
                   <td className="p-6 text-right">
                     <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full font-bold text-sm ${
                        item.trend === 'up' ? 'bg-agrimind-900/30 text-agrimind-400 border border-agrimind-500/20' :
                        item.trend === 'down' ? 'bg-red-900/20 text-red-400 border border-red-500/20' :
                        'bg-gray-800 text-gray-300 border border-gray-600/30'
                     }`}>
                       {item.trend === 'up' && <TrendingUp size={16} />}
                       {item.trend === 'down' && <TrendingDown size={16} />}
                       {item.trend === 'stable' && <Minus size={16} />}
                       <span>{item.percentage > 0 ? `${item.percentage}%` : 'Stable'}</span>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>

       </div>

       <div className="glass-card p-6 border-white/5 text-sm text-gray-400 text-center flex items-center justify-center space-x-2">
         <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
         <span>Live data dynamically generated for all APMC markets across India regions</span>
       </div>

    </div>
  );
};

export default MarketChart;
