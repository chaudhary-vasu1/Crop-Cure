import { useState, useEffect } from 'react';
import api from '../utils/api';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative animate-scale-up">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center relative">
                    <button onClick={onClose} className="absolute text-blue-200 top-4 right-4 hover:text-white font-bold text-lg">
                        ✕
                    </button>
                    <h2 className="text-2xl font-bold flex justify-center items-center gap-2">
                        💧 Smart Irrigation
                    </h2>
                    <p className="opacity-90 mt-1 font-medium">{plot.name} ({plot.area} Acres of {plot.cropType})</p>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-blue-600 dark:text-blue-400 font-semibold animate-pulse">Fetching live weather & crop needs...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500 font-bold mb-4">{error}</p>
                            <button onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">
                                Close
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-fade-in">
                            
                            {/* Weather Card */}
                            {adviceData.currentWeather && (
                                <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl">
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase">Local Weather</p>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 capitalize">
                                            {adviceData.currentWeather.temp}°C, {adviceData.currentWeather.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 font-semibold uppercase">Humidity</p>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{adviceData.currentWeather.humidity}%</p>
                                    </div>
                                </div>
                            )}

                            {/* Recommendation Summary */}
                            <div className="p-4 rounded-xl border text-center bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800">
                                <span className={`inline-block px-3 py-1 text-xs font-extrabold rounded-full mb-2 uppercase ${
                                    adviceData.recommendation.action === 'Pause Irrigation' 
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' 
                                        : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                }`}>
                                    {adviceData.recommendation.action}
                                </span>
                                <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 px-2">
                                    {adviceData.recommendation.reason}
                                </h3>
                            </div>

                            {/* Water Volume Cards */}
                            {adviceData.recommendation.action !== 'Pause Irrigation' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50/30 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-950 p-4 rounded-xl text-center animate-pulse-slow">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Volume Needed</p>
                                        <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{volumes.liters} L</p>
                                    </div>
                                    <div className="bg-blue-50/30 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-950 p-4 rounded-xl text-center">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">In Gallons</p>
                                        <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{volumes.gallons} G</p>
                                    </div>
                                </div>
                            )}

                            {/* Schedule Details */}
                            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold">⏱️ Frequency:</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-200">{adviceData.recommendation.frequency}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold">🚰 Flow Rate:</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-200">{adviceData.recommendation.waterVolume}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold">⚠️ Urgency:</span>
                                    <span className={`font-bold capitalize ${
                                        adviceData.recommendation.urgency === 'High' ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'
                                    }`}>{adviceData.recommendation.urgency}</span>
                                </div>
                            </div>

                            <button 
                                onClick={onClose}
                                className="w-full py-3 font-bold text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-xl transition shadow-md"
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