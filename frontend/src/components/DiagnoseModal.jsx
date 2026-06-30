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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-2xl shadow-2xl p-6 relative animate-scale-up">
                
                {/* Close Button */}
                <button onClick={resetAndClose} className="absolute text-gray-400 top-4 right-4 hover:text-gray-600 transition border-none bg-transparent cursor-pointer text-lg font-bold">
                    ✕
                </button>

                <h2 className="mb-4 text-2xl font-bold text-green-700 dark:text-green-500 text-left">
                    Diagnose: {plot.name} ({plot.cropType})
                </h2>

                {/* Upload Section (Hides if AI has returned a diagnosis) */}
                {!diagnosis ? (
                    <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-green-200 dark:border-green-900/50 border-dashed rounded-xl bg-green-50/50 dark:bg-green-950/10">
                            {preview ? (
                                <img src={preview} alt="Crop preview" className="object-cover max-h-64 rounded-xl mb-4 shadow-sm" />
                            ) : (
                                <p className="mb-4 text-gray-500 dark:text-gray-400 font-medium">Upload a photo of a sick leaf</p>
                            )}
                            
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-green-100 dark:file:bg-green-950/55 file:text-green-700 dark:file:text-green-400 hover:file:bg-green-200 cursor-pointer"
                            />
                        </div>

                        {error && <p className="text-sm font-semibold text-center text-red-500">{error}</p>}

                        <button 
                            onClick={handleDiagnose}
                            disabled={loading || !file}
                            className={`w-full py-3 font-bold text-white rounded-xl transition border-none cursor-pointer ${
                                loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md'
                            }`}
                        >
                            {loading ? '🧠 AI is analyzing...' : 'Run Diagnostics'}
                        </button>
                    </div>
                ) : (
                    /* The Results Panel (Shows when AI is done!) */
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl">
                            <h3 className="text-base font-bold text-blue-800 dark:text-blue-400">Diagnosis Results</h3>
                            <p className="text-2xl font-black text-gray-800 dark:text-white mt-1 capitalize">{diagnosis.diseaseName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                AI Confidence: <span className="font-bold text-green-600 dark:text-green-400">{(diagnosis.confidenceScore * 100).toFixed(0)}%</span>
                            </p>
                            
                            {diagnosis.isContagious && (
                                <span className="inline-block px-2.5 py-1 mt-2.5 text-xs font-extrabold text-white bg-red-500 rounded-full uppercase tracking-wider animate-pulse">
                                    ⚠️ Contagious
                                </span>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1.5 text-sm">🌱 Organic Treatment</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{diagnosis.treatmentPlan.organic}</p>
                            </div>
                            <div className="p-3 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-1 flex items-center gap-1.5 text-sm">🧪 Chemical Treatment</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{diagnosis.treatmentPlan.chemical}</p>
                            </div>
                        </div>

                        <button 
                            onClick={resetAndClose}
                            className="w-full py-2.5 mt-4 font-bold text-gray-700 dark:text-gray-300 bg-gray-250 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl border-none cursor-pointer transition"
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