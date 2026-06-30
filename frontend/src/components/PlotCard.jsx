import { useState } from 'react';
import { Trash2, MapPin, Layers, Droplet, AlertTriangle, Check, X } from 'lucide-react';

const PlotCard = ({ plot, onDelete, onDiagnose, onIrrigation }) => {
    const [isConfirming, setIsConfirming] = useState(false);

    return (
        <div className="relative flex flex-col h-full p-5 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 border-l-4 border-l-green-600 rounded-r-2xl rounded-l-md shadow-sm hover:shadow-md hover:-translate-y-1 transform hover:scale-[1.01] transition-all duration-300 overflow-hidden">
            
            {/* Inline Deletion Confirm Overlay */}
            {isConfirming ? (
                <div className="absolute inset-0 bg-red-50/95 dark:bg-red-950/90 z-20 flex flex-col justify-center items-center p-6 text-center animate-fade-in">
                    <AlertTriangle size={36} className="text-red-500 mb-3 animate-pulse" />
                    <h4 className="text-lg font-black text-red-700 dark:text-red-300">Delete Plot?</h4>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-[200px] leading-relaxed">
                        Are you sure you want to remove <strong>{plot.name}</strong>? This cannot be undone.
                    </p>
                    <div className="flex gap-3 mt-5 w-full max-w-[220px]">
                        <button
                            onClick={() => setIsConfirming(false)}
                            className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs border-none cursor-pointer flex items-center justify-center gap-1 transition"
                        >
                            <X size={12} />
                            <span>Cancel</span>
                        </button>
                        <button
                            onClick={() => onDelete(plot._id)}
                            className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs border-none cursor-pointer flex items-center justify-center gap-1 transition shadow-md"
                        >
                            <Check size={12} />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            ) : null}

            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
                <div className="text-left">
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-500 leading-tight">
                        {plot.name || 'Unnamed Plot'}
                    </h3>
                    <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">
                        {plot.cropType || 'Crop not specified'}
                    </p>
                </div>
                <button 
                    onClick={() => setIsConfirming(true)} 
                    className="text-gray-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 border-none cursor-pointer bg-transparent"
                    title="Delete Plot"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Plot Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-left mb-6 mt-1 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-400">Area:</span>
                    <span className="font-medium">{plot.area || 0} acres</span>
                </div>
                {plot.location && (
                    <div className="flex items-center gap-1.5 truncate">
                        <MapPin size={14} className="text-gray-400 shrink-0" />
                        <span className="font-medium truncate">{plot.location}</span>
                    </div>
                )}
                {plot.soilType && (
                    <div className="flex items-center gap-1.5">
                        <Layers size={14} className="text-gray-400 shrink-0" />
                        <span className="font-medium">{plot.soilType} Soil</span>
                    </div>
                )}
                {plot.irrigationMethod && (
                    <div className="flex items-center gap-1.5">
                        <Droplet size={14} className="text-gray-400 shrink-0" />
                        <span className="font-medium">{plot.irrigationMethod}</span>
                    </div>
                )}
            </div>

            {/* Action Buttons (Pushed to the bottom) */}
            <div className="flex gap-2 pt-4 mt-auto border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={() => onDiagnose(plot)}
                    className="flex-1 py-2.5 font-bold text-blue-700 dark:text-blue-400 transition bg-blue-50 dark:bg-blue-950/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-950/60 border-none cursor-pointer"
                >
                    🩺 Diagnose
                </button>
                <button
                    onClick={() => onIrrigation(plot)}
                    className="flex-1 py-2.5 font-bold text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm border-none cursor-pointer"
                >
                    💧 Irrigate
                </button>
            </div>
        </div>
    );
};

export default PlotCard;