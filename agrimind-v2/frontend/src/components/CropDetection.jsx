import React, { useState } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';

const CropDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null); // Reset
    }
  };

  const handleScan = async () => {
    if (!file) return;
    
    setLoading(true);
    
    // Simulate File Upload to correct Endpoint
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/disease/detect`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Failed to connect to AI Scanner."});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 md:p-6 w-full max-w-5xl mx-auto space-y-6">
      
      <div className="glass-card p-6 md:p-8 bg-black/40 border border-white/5 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Crop Health Scanner</h2>
        <p className="text-gray-400">Upload a clear picture of an infected leaf to detect diseases.</p>
        
        <div className="mt-8 relative">
          {!preview ? (
            <label className="border-2 border-dashed border-white/20 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-agrimind-500/50 transition-all group h-64">
              <Upload size={48} className="text-gray-500 group-hover:text-agrimind-500 group-hover:-translate-y-2 transition-all duration-300" />
              <span className="mt-4 text-gray-300 font-medium">Click to upload Leaf Picture</span>
              <span className="mt-2 text-xs text-gray-500">JPG, PNG up to 5MB</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 h-64 md:h-96 w-full max-w-2xl mx-auto group">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="cursor-pointer bg-black/60 px-6 py-3 rounded-xl border border-white/20 hover:bg-black/80 flex items-center gap-2">
                  <ImageIcon size={18}/> Change Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          )}
        </div>

        {preview && !result && (
          <button 
            onClick={handleScan}
            disabled={loading}
            className="mt-8 px-8 py-4 bg-gradient-to-r from-agrimind-600 to-agrimind-500 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(34,176,110,0.5)] disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center mx-auto"
          >
            {loading ? (
              <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-t-white border-white/20 rounded-full animate-spin"></div> Scanning Leaf API...</span>
            ) : "Scan for Disease"}
          </button>
        )}
      </div>

      {/* Result Card */}
      {result && result.disease && (
        <div className="glass-card p-6 md:p-8 animate-fade-in-up border-agrimind-500/30">
          <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
            <div className="w-16 h-16 rounded-full bg-agrimind-500/20 flex items-center justify-center shrink-0">
               {result.disease === 'Healthy Crop' ? <CheckCircle size={32} className="text-agrimind-400" /> : <AlertTriangle size={32} className="text-yellow-400" />}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Diagnosis: {result.disease}</h3>
              <p className="text-agrimind-400 font-medium">Confidence: {result.confidence}%</p>
            </div>
          </div>
          
          <div className="mt-8 bg-black/40 p-6 rounded-xl border border-white/5 inline-block w-full">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 block">Recommended Solution</h4>
            <p className="text-gray-200 leading-relaxed text-lg">{result.solution}</p>
          </div>
        </div>
      )}

      {/* Error Card */}
      {result && result.error && (
         <div className="glass-card bg-red-900/20 border-red-500/30 p-6 text-red-200 text-center">
            {result.error}
         </div>
      )}
    </div>
  );
};

export default CropDetection;
