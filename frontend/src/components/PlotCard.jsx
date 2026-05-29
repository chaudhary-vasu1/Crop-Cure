const PlotCard = ({ plot, onDelete, onDiagnose, onIrrigation }) => {
    return (
        <div className="p-4 transition-shadow bg-white border border-green-200 rounded-lg shadow-sm hover:shadow-md">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-bold text-green-800">
                        {plot.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-600">
                        {plot.cropType}
                    </p>
                </div>

                <button
                    onClick={() => onDelete(plot._id)}
                    className="text-sm text-red-500 hover:text-red-700"
                    title="Delete Plot"
                >
                    ✕
                </button>
            </div>

            {/* Details */}
            <div className="mt-4 space-y-1 text-sm text-gray-700">
                <p>
                    <span className="font-medium">Location:</span>{" "}
                    {plot.location}
                </p>

                <p>
                    <span className="font-medium">Soil:</span>{" "}
                    {plot.soilType}
                </p>

                <p>
                    <span className="font-medium">Irrigation:</span>{" "}
                    {plot.irrigationMethod}
                </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-4">

                {/* Diagnose Button */}
                <button
                    onClick={() => onDiagnose(plot)}
                    className="flex-1 py-2 text-sm font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
                >
                    🔍 Diagnose
                </button>

                {/* Irrigation Button */}
                <button
                    onClick={() => onIrrigation(plot)}
                    className="flex-1 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                >
                    💧 Irrigation
                </button>

            </div>

        </div>
    );
};

export default PlotCard;