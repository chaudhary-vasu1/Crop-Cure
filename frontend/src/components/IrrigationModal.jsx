import { useState, useEffect } from 'react';
import api from '../utils/api';

const IrrigationModal = ({ isOpen, onClose, plot }) => {
    const [irrigationData, setIrrigationData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch the data automatically when the modal opens and a plot is provided
    useEffect(() => {
        const fetchIrrigationAdvice = async () => {
            if (!isOpen || !plot) return;
            
            setLoading(true);
            setError(null);
            setIrrigationData(null);

            try {
                const response = await api.get(`/irrigation/${plot._id}`);
                setIrrigationData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load irrigation data.');
            } finally {
                setLoading(false);
            }
        };

        fetchIrrigationAdvice();
    }, [isOpen, plot]);

    if (!isOpen || !plot) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-60">
            <div className="w-full max-w-2xl my-8 bg-white rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 text-white bg-blue-600 rounded-t-lg">
                    <h2 className="text-2xl font-bold">
                        Smart Irrigation: {plot.name}
                    </h2>
                    <button onClick={onClose} className="text-2xl font-bold text-blue-200 hover:text-white">✕</button>
                </div>

                <div className="p-6">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                            <p className="font-medium text-gray-600">Checking local weather and soil conditions...</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 text-red-700 bg-red-100 rounded-lg">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {irrigationData && (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Weather Widget */}
                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <h3 className="mb-3 text-lg font-bold text-gray-700">📍 Current Local Weather ({plot.location})</h3>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <p className="text-sm text-gray-500">Condition</p>
                                        <p className="font-bold text-blue-800 capitalize">{irrigationData.currentWeather.description}</p>
                                    </div>
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <p className="text-sm text-gray-500">Temp</p>
                                        <p className="font-bold text-red-600">{irrigationData.currentWeather.temp}°C</p>
                                    </div>
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <p className="text-sm text-gray-500">Humidity</p>
                                        <p className="font-bold text-blue-600">{irrigationData.currentWeather.humidity}%</p>
                                    </div>
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <p className="text-sm text-gray-500">Rain (1h)</p>
                                        <p className="font-bold text-indigo-600">{irrigationData.currentWeather.rainfallAmount} mm</p>
                                    </div>
                                </div>
                            </div>

                            {/* Advice Card */}
                            <div className={`p-5 rounded-lg border-2 ${
                                irrigationData.recommendation.action === 'Irrigate' 
                                    ? 'bg-blue-50 border-blue-300' 
                                    : 'bg-green-50 border-green-300'
                            }`}>
                                <h3 className="mb-4 text-xl font-bold text-gray-800">
                                    Action Required: <span className={irrigationData.recommendation.action === 'Irrigate' ? 'text-blue-700' : 'text-green-700'}>
                                        {irrigationData.recommendation.action}
                                    </span>
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-gray-600">Recommended Volume</p>
                                        <p className="text-lg font-semibold">{irrigationData.recommendation.waterVolume}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Recommended Frequency</p>
                                        <p className="text-lg font-semibold">{irrigationData.recommendation.frequency}</p>
                                    </div>
                                </div>

                                <div className="padding-4 mt-4 bg-white border border-gray-200 rounded p-3">
                                    <p className="text-sm text-gray-600 font-bold mb-1">Why?</p>
                                    <p className="text-gray-800 text-sm">{irrigationData.recommendation.reason}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={onClose} 
                                className="w-full py-2 font-bold text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IrrigationModal;