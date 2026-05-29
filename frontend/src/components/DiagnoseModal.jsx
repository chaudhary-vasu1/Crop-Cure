import { useState } from 'react';
import api from '../utils/api';

const DiagnoseModal = ({ isOpen, onClose, plot }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [diagnosis, setDiagnosis] = useState(null);
    const [error, setError] = useState(null);

    if (!isOpen || !plot) return null;

    // Handle file selection and create a preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setDiagnosis(null); // Reset previous diagnosis if a new image is selected
            setError(null);
        }
    };

    // Send the image to the backend
    const handleAnalyze = async () => {
        if (!selectedFile) {
            setError("Please select an image first.");
            return;
        }

        setLoading(true);
        setError(null);

        // We MUST use FormData when sending files via HTTP
        const formData = new FormData();
        formData.append('image', selectedFile); 

        try {
            // The Axios interceptor automatically adds the JWT token
            const response = await api.post(`/diagnostics/${plot._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDiagnosis(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to analyze image. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // Reset everything when closing
    const handleClose = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setDiagnosis(null);
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-60 z-50 overflow-y-auto">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl my-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-green-800">
                        Diagnose Crop: {plot.name} ({plot.cropType})
                    </h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-red-500 text-xl font-bold">✕</button>
                </div>

                {/* Upload & Preview Section */}
                {!diagnosis && (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center bg-green-50">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Crop preview" className="mx-auto max-h-64 rounded shadow-sm mb-4" />
                            ) : (
                                <p className="text-gray-500 mb-4">Upload a clear photo of the affected plant leaf.</p>
                            )}
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                            />
                        </div>

                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <button 
                            onClick={handleAnalyze} 
                            disabled={!selectedFile || loading}
                            className={`w-full py-3 rounded font-bold text-white transition-colors ${
                                loading || !selectedFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {loading ? 'AI is Analyzing Image...' : 'Run Diagnostics'}
                        </button>
                    </div>
                )}

                {/* AI Result Section */}
                {diagnosis && (
                    <div className="space-y-4 animate-fadeIn">
                        <div className={`p-4 rounded-lg border ${diagnosis.diseaseName.toLowerCase() === 'healthy' ? 'bg-green-100 border-green-300' : 'bg-red-50 border-red-200'}`}>
                            <h3 className="text-xl font-bold mb-1">
                                Diagnosis: <span className={diagnosis.diseaseName.toLowerCase() === 'healthy' ? 'text-green-700' : 'text-red-700'}>{diagnosis.diseaseName}</span>
                            </h3>
                            <p className="text-sm text-gray-600">
                                AI Confidence: {(diagnosis.confidenceScore * 100).toFixed(1)}%
                            </p>
                            {diagnosis.isContagious && (
                                <span className="inline-block mt-2 px-2 py-1 text-xs font-bold text-red-800 bg-red-200 rounded">
                                    ⚠️ Highly Contagious
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <h4 className="font-bold text-amber-900 mb-2">🌿 Organic Treatment</h4>
                                <p className="text-sm text-amber-800 whitespace-pre-wrap">{diagnosis.treatmentPlan.organic}</p>
                            </div>
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-bold text-blue-900 mb-2">🧪 Chemical Treatment</h4>
                                <p className="text-sm text-blue-800 whitespace-pre-wrap">{diagnosis.treatmentPlan.chemical}</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleClose} 
                            className="w-full py-2 mt-4 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-300"
                        >
                            Close & Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiagnoseModal;