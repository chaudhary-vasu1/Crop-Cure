import { useState } from 'react';
import api from '../utils/api'; 
import { MapPin, Sparkles, X, Layers, Droplet } from 'lucide-react';

const AddPlotModal = ({ isOpen, onClose, onPlotAdded }) => {
    const [name, setName] = useState('');
    const [cropType, setCropType] = useState('');
    const [area, setArea] = useState('');
    const [location, setLocation] = useState('Meerut');
    const [soilType, setSoilType] = useState('Loamy');
    const [irrigationMethod, setIrrigationMethod] = useState('Drip');
    const [loading, setLoading] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);

    const handleGpsDetect = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await api.get(`/weather/reverse-geocode?lat=${latitude}&lng=${longitude}`);
                    setLocation(response.data.location);
                } catch (err) {
                    console.error("GPS resolve error:", err);
                    alert("Failed to auto-detect location. Please enter it manually.");
                } finally {
                    setGpsLoading(false);
                }
            },
            (err) => {
                console.error("GPS permission error:", err);
                alert("Geolocation access denied. Please type your location manually.");
                setGpsLoading(false);
            }
        );
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/plots', { 
                name, 
                cropType, 
                area: Number(area),
                location,
                soilType,
                irrigationMethod
            });
            
            onPlotAdded(response.data); 
            
            // Reset form and close
            setName(''); 
            setCropType(''); 
            setArea('');
            setLocation('Meerut');
            setSoilType('Loamy');
            setIrrigationMethod('Drip');
            onClose();
        } catch (error) {
            console.error("Failed to add plot:", error);
            alert("Error saving plot. Check your backend logs!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-2xl animate-scale-in text-left">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-1.5">
                        🚜 Add New Plot
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-850 rounded-xl transition border-none cursor-pointer bg-transparent"
                    >
                        <X size={16} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-2">Plot Name</label>
                        <input 
                            type="text" required value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 dark:text-white"
                            placeholder="e.g. North Field"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-2">Crop Type</label>
                        <input 
                            type="text" required value={cropType} onChange={(e) => setCropType(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 dark:text-white"
                            placeholder="e.g. Wheat, Corn, Cotton"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-2">Area (acres)</label>
                            <input 
                                type="number" required min="0.1" step="0.1" value={area} onChange={(e) => setArea(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-2">Location/City</label>
                            <input 
                                type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-semibold text-slate-800 dark:text-white"
                                placeholder="e.g. Meerut, Delhi"
                            />
                            <button
                                type="button"
                                disabled={gpsLoading}
                                onClick={handleGpsDetect}
                                className="mt-2 w-full py-2 px-3 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-450 bg-emerald-50/60 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 rounded-xl cursor-pointer transition border border-dashed border-emerald-300/40 dark:border-emerald-800/40 text-center flex items-center justify-center gap-1.5 active:scale-95"
                            >
                                <MapPin size={12} className={gpsLoading ? "animate-pulse" : ""} />
                                <span>{gpsLoading ? "Detecting..." : "Detect GPS"}</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-2">Soil Type</label>
                            <select 
                                value={soilType} onChange={(e) => setSoilType(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
                            >
                                <option value="Loamy">Loamy</option>
                                <option value="Clay">Clay</option>
                                <option value="Sandy">Sandy</option>
                                <option value="Silt">Silt</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-2">Irrigation Method</label>
                            <select 
                                value={irrigationMethod} onChange={(e) => setIrrigationMethod(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
                            >
                                <option value="Drip">Drip</option>
                                <option value="Sprinkler">Sprinkler</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2.5 mt-6 border-t border-slate-100 dark:border-gray-800 pt-5">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs border-none cursor-pointer transition active:scale-95"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 text-white font-bold rounded-xl text-xs border-none cursor-pointer transition shadow-md active:scale-95"
                        >
                            {loading ? 'Saving...' : 'Save Plot'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPlotModal;