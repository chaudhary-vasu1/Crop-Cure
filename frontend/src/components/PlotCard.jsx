const PlotCard = ({ plot, onDelete, onDiagnose, onIrrigation }) => {
    return (
        <div className="flex flex-col h-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
            
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-green-700">{plot.name || 'Unnamed Plot'}</h3>
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">Crop:</span> {plot.cropType || 'Not specified'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">Area:</span> {plot.area || 0} acres
                    </p>
                </div>
                <button 
                    onClick={() => onDelete(plot._id)} 
                    className="text-sm font-bold text-red-500 hover:text-red-700"
                >
                    Delete
                </button>
            </div>

            {/* Action Buttons (Pushed to the bottom) */}
            <div className="flex gap-2 pt-4 mt-auto border-t border-gray-100">
                <button
                    onClick={() => onDiagnose(plot)}
                    className="flex-1 py-2 font-semibold text-blue-700 transition bg-blue-100 rounded hover:bg-blue-200"
                >
                    🩺 Diagnose
                </button>
                <button
                    onClick={() => onIrrigation(plot)}
                    className="flex-1 py-2 font-semibold text-white transition bg-blue-500 rounded hover:bg-blue-600"
                >
                    💧 Irrigate
                </button>
            </div>
        </div>
    );
};

export default PlotCard;