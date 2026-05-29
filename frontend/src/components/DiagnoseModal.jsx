import { useState } from 'react';
import api from '../utils/api';

const DiagnoseModal = ({ isOpen, onClose, plot }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [diagnosis, setDiagnosis] = useState(null);
    const [error, setError] = useState(null);

    if (!isOpen || !plot) return null;

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setDiagnosis(null); // Reset previous results if they pick a new photo
            setError(null);
        }
    };

    const handleDiagnose = async () => {
        if (!file) {
            setError("Please select an image first.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        // Note: Make sure your backend multer expects a field named 'image'
        formData.append('image', file); 

        try {
            const response = await api.post(`/diagnostics/${plot._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDiagnosis(response.data); // Save the AI result to state!
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to analyze the image.");
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setFile(null);
        setPreview(null);
        setDiagnosis(null);
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6 relative">
                
                {/* Close Button */}
                <button onClick={resetAndClose} className="absolute text-gray-500 top-4 right-4 hover:text-gray-800">
                    ✕
                </button>

                <h2 className="mb-4 text-2xl font-bold text-green-700">
                    Diagnose: {plot.name} ({plot.cropType})
                </h2>

                {/* Upload Section (Hides if AI has returned a diagnosis) */}
                {!diagnosis ? (
                    <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-green-200 border-dashed rounded-lg bg-green-50">
                            {preview ? (
                                <img src={preview} alt="Crop preview" className="object-cover max-h-64 rounded-md mb-4 shadow-sm" />
                            ) : (
                                <p className="mb-4 text-gray-500">Upload a photo of a sick leaf</p>
                            )}
                            
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                            />
                        </div>

                        {error && <p className="text-sm font-semibold text-center text-red-500">{error}</p>}

                        <button 
                            onClick={handleDiagnose}
                            disabled={loading || !file}
                            className={`w-full py-3 font-bold text-white rounded transition ${
                                loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md'
                            }`}
                        >
                            {loading ? '🧠 AI is analyzing...' : 'Run Diagnostics'}
                        </button>
                    </div>
                ) : (
                    /* The Results Panel (Shows when AI is done!) */
                    <div className="space-y-4 animate-fade-in">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="text-lg font-bold text-blue-800">Diagnosis Results</h3>
                            <p className="text-xl font-bold text-gray-800 mt-2">{diagnosis.diseaseName}</p>
                            <p className="text-sm text-gray-600">
                                AI Confidence: <span className="font-semibold text-green-600">{(diagnosis.confidenceScore * 100).toFixed(0)}%</span>
                            </p>
                            
                            {diagnosis.isContagious && (
                                <span className="inline-block px-2 py-1 mt-2 text-xs font-bold text-white bg-red-500 rounded">
                                    ⚠️ Contagious
                                </span>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 border rounded">
                                <h4 className="font-bold text-green-700 mb-1">🌱 Organic Treatment</h4>
                                <p className="text-sm text-gray-700">{diagnosis.treatmentPlan.organic}</p>
                            </div>
                            <div className="p-3 bg-gray-50 border rounded">
                                <h4 className="font-bold text-purple-700 mb-1">🧪 Chemical Treatment</h4>
                                <p className="text-sm text-gray-700">{diagnosis.treatmentPlan.chemical}</p>
                            </div>
                        </div>

                        <button 
                            onClick={resetAndClose}
                            className="w-full py-2 mt-4 font-bold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiagnoseModal;