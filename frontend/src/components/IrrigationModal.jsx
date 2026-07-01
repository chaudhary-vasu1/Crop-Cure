import { useState, useEffect } from 'react';
import api from '../utils/api';
import { X, Droplets, Loader2, CloudRain, ShieldAlert, Sparkles } from 'lucide-react';

const IrrigationModal = ({ isOpen, onClose, plot }) => {
    const [loading, setLoading] = useState(true);
    const [adviceData, setAdviceData] = useState(null);
    const [volumes, setVolumes] = useState({ liters: '0', gallons: '0' });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && plot) {
            const fetchAdvice = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await api.get(`/irrigation/${plot._id}`);
                    const data = response.data;
                    setAdviceData(data);
                    
                    // Calculate scaled volumetric needs based on crop, area, and backend weatherVolume
                    const waterVol = data.recommendation.waterVolume;
                    const calculated = calculateWaterNeeds(plot.cropType, plot.area, waterVol);
                    setVolumes(calculated);
                } catch (err) {
                    console.error("Error fetching irrigation advice:", err);
                    setError("Failed to fetch live irrigation plan.");
                } finally {
                    setLoading(false);
                }
            };
            fetchAdvice();
        }
    }, [isOpen, plot]);

    const calculateWaterNeeds = (crop, area, weatherVolume) => {
        const normalizedCrop = crop.toLowerCase().trim();
        const cropData = {
            sugarcane: { base: 25000 },
            rice: { base: 30000 },
            wheat: { base: 15000 },
            corn: { base: 18000 },
            cotton: { base: 20000 },
            default: { base: 15000 }
        };

        const cropStats = cropData[normalizedCrop] || cropData.default;
        
        let multiplier = 1.0;
        if (weatherVolume === 'None') multiplier = 0;
        else if (weatherVolume === 'Low' || weatherVolume === 'Low to Moderate') multiplier = 0.7;
        else if (weatherVolume === 'High') multiplier = 1.3;

        const totalLiters = Math.round(cropStats.base * area * multiplier);
        const totalGallons = Math.round(totalLiters * 0.264172);

        return {
            liters: totalLiters.toLocaleString(),
            gallons: totalGallons.toLocaleString()
        };
    };

    if (!isOpen || !plot) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-2xl overflow-hidden relative animate-scale-in text-left">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center relative">
                    <button 
                        onClick={onClose} 
                        className="absolute p-1.5 text-blue-200 top-4 right-4 hover:text-white hover:bg-white/10 rounded-xl transition border-none cursor-pointer bg-transparent"
                    >
                        <X size={16} />
                    </button>
                    <h2 className="text-xl font-black flex justify-center items-center gap-1.5 text-white">
                        💧 Smart Irrigation
                    </h2>
                    <p className="opacity-90 mt-1.5 text-xs font-semibold">{plot.name} ({plot.area} Acres of {plot.cropType})</p>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-16 gap-3 text-slate-450 dark:text-slate-500">
                            <Loader2 size={32} className="animate-spin text-blue-500" />
                            <p className="text-xs font-bold animate-pulse">Calculating crop water needs...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 flex flex-col items-center gap-4">
                            <ShieldAlert size={36} className="text-red-500" />
                            <p className="text-xs font-bold text-red-500">{error}</p>
                            <button 
                                onClick={onClose} 
                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border-none cursor-pointer transition"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-fade-in">
                            
                            {/* Weather Card */}
                            {adviceData.currentWeather && (
                                <div className="flex items-center justify-between p-3.5 bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-950 rounded-xl text-xs">
                                    <div>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Local Temperature</p>
                                        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 capitalize mt-0.5">
                                            {adviceData.currentWeather.temp}°C, {adviceData.currentWeather.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Humidity</p>
                                        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{adviceData.currentWeather.humidity}%</p>
                                    </div>
                                </div>
                            )}

                            {/* Recommendation Summary */}
                            <div className="p-5 rounded-2xl border text-center bg-slate-50 dark:bg-gray-950 border-slate-200/50 dark:border-gray-800/50">
                                <span className={`inline-block px-3 py-0.5 text-[9px] font-black rounded-full mb-2.5 uppercase tracking-wider ${
                                    adviceData.recommendation.action === 'Pause Irrigation' 
                                        ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400 border border-yellow-250/20' 
                                        : 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-250/20'
                                }`}>
                                    {adviceData.recommendation.action}
                                </span>
                                <h3 className="text-sm font-extrabold text-slate-850 dark:text-slate-100 px-2 leading-relaxed">
                                    {adviceData.recommendation.reason}
                                </h3>
                            </div>

                            {/* Water Volume Cards */}
                            {adviceData.recommendation.action !== 'Pause Irrigation' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-950 p-4 rounded-xl text-center">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Volume Needed</p>
                                        <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">{volumes.liters} L</p>
                                    </div>
                                    <div className="bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-950 p-4 rounded-xl text-center">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">In Gallons</p>
                                        <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">{volumes.gallons} G</p>
                                    </div>
                                </div>
                            )}

                            {/* Schedule Details */}
                            <div className="space-y-2 pt-2 border-t border-slate-150 dark:border-gray-800">
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-gray-950/50 p-3 rounded-xl text-xs font-semibold">
                                    <span className="text-slate-500 dark:text-slate-400">⏱️ Frequency:</span>
                                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{adviceData.recommendation.frequency}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-gray-950/50 p-3 rounded-xl text-xs font-semibold">
                                    <span className="text-slate-500 dark:text-slate-400">🚰 Water Level:</span>
                                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{adviceData.recommendation.waterVolume}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-gray-950/50 p-3 rounded-xl text-xs font-semibold">
                                    <span className="text-slate-500 dark:text-slate-400">⚠️ Urgency:</span>
                                    <span className={`font-extrabold uppercase tracking-wide text-[10px] px-2 py-0.5 rounded ${
                                        adviceData.recommendation.urgency === 'High' 
                                            ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200/20' 
                                            : 'text-slate-800 dark:text-slate-200'
                                    }`}>{adviceData.recommendation.urgency}</span>
                                </div>
                            </div>

                            <button 
                                onClick={onClose}
                                className="w-full py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md border-none cursor-pointer text-xs active:scale-95 mt-4"
                            >
                                Acknowledge Schedule
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IrrigationModal;