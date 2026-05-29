import { useState, useEffect } from 'react';

const IrrigationModal = ({ isOpen, onClose, plot }) => {
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState(null);

    // This runs automatically whenever the modal opens
    useEffect(() => {
        if (isOpen && plot) {
            setLoading(true);
            
            // We use a slight delay to simulate complex AI/Backend calculations for better UX
            setTimeout(() => {
                const plan = calculateWaterNeeds(plot.cropType, plot.area);
                setSchedule(plan);
                setLoading(false);
            }, 800);
        }
    }, [isOpen, plot]);

    // The core calculation logic
    const calculateWaterNeeds = (crop, area) => {
        const normalizedCrop = crop.toLowerCase().trim();
        
        // Base water needs in liters per acre per day
        const cropData = {
            sugarcane: { base: 25000, frequency: "Daily", type: "Heavy" },
            rice: { base: 30000, frequency: "Daily", type: "Flooded" },
            wheat: { base: 15000, frequency: "Every 2-3 Days", type: "Moderate" },
            corn: { base: 18000, frequency: "Every 2 Days", type: "Moderate" },
            cotton: { base: 20000, frequency: "Every 3 Days", type: "Deep soaking" },
            default: { base: 15000, frequency: "Check soil moisture daily", type: "Moderate" }
        };

        const cropStats = cropData[normalizedCrop] || cropData.default;
        const totalLiters = cropStats.base * area;
        const totalGallons = Math.round(totalLiters * 0.264172);

        return {
            liters: totalLiters.toLocaleString(),
            gallons: totalGallons.toLocaleString(),
            frequency: cropStats.frequency,
            type: cropStats.type,
        };
    };

    if (!isOpen || !plot) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden relative">
                
                {/* Header */}
                <div className="bg-blue-600 p-6 text-white text-center">
                    <button onClick={onClose} className="absolute text-blue-200 top-4 right-4 hover:text-white font-bold">
                        ✕
                    </button>
                    <h2 className="text-2xl font-bold flex justify-center items-center gap-2">
                        💧 Irrigation Plan
                    </h2>
                    <p className="opacity-90 mt-1">{plot.name} ({plot.area} Acres of {plot.cropType})</p>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-blue-600 font-semibold animate-pulse">Calculating optimal water volume...</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            
                            {/* Water Volume Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-center">
                                    <p className="text-sm text-gray-500 font-semibold">Daily Requirement</p>
                                    <p className="text-2xl font-bold text-blue-700">{schedule.liters} L</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-center">
                                    <p className="text-sm text-gray-500 font-semibold">In Gallons</p>
                                    <p className="text-2xl font-bold text-blue-700">{schedule.gallons} G</p>
                                </div>
                            </div>

                            {/* Schedule Details */}
                            <div className="space-y-3 border-t pt-4">
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                    <span className="text-gray-600 font-semibold">⏱️ Frequency:</span>
                                    <span className="font-bold text-gray-800">{schedule.frequency}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                    <span className="text-gray-600 font-semibold">🚰 Watering Type:</span>
                                    <span className="font-bold text-gray-800">{schedule.type}</span>
                                </div>
                            </div>

                            <button 
                                onClick={onClose}
                                className="w-full py-3 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 transition shadow-sm"
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