import { Trash2, MapPin, Layers, Droplet } from 'lucide-react';

const PlotCard = ({ plot, onDelete, onDiagnose, onIrrigation }) => {
    return (
        <div className="flex flex-col h-full p-5 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 border-l-4 border-l-green-600 rounded-r-2xl rounded-l-md shadow-sm hover:shadow-md hover:-translate-y-1 transform hover:scale-[1.01] transition-all duration-300">
            
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
                    onClick={() => onDelete(plot._id)} 
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