import { useState } from 'react';
import api from '../utils/api';

const AddPlotModal = ({ isOpen, onClose, onPlotAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        cropType: '',
        location: '',
        soilType: 'Loamy', // Default selection
        irrigationMethod: 'Drip' // Default selection
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Our Axios interceptor automatically attaches the JWT here!
            const response = await api.post('/plots', formData);
            onPlotAdded(response.data); // Update the parent UI
            onClose(); // Close the modal
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add plot');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-xl font-bold text-green-800">Add New Farm Plot</h2>
                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input 
                        type="text" name="name" placeholder="Plot Name (e.g., North Field)" 
                        required className="w-full p-2 border rounded" 
                        onChange={handleChange} 
                    />
                    <input 
                        type="text" name="cropType" placeholder="Crop Type (e.g., Tomato)" 
                        required className="w-full p-2 border rounded" 
                        onChange={handleChange} 
                    />
                    <input 
                        type="text" name="location" placeholder="Location (City, State)" 
                        required className="w-full p-2 border rounded" 
                        onChange={handleChange} 
                    />
                    
                    <select name="soilType" className="w-full p-2 border rounded" onChange={handleChange}>
                        <option value="Loamy">Loamy</option>
                        <option value="Clay">Clay</option>
                        <option value="Sandy">Sandy</option>
                        <option value="Silt">Silt</option>
                    </select>

                    <select name="irrigationMethod" className="w-full p-2 border rounded" onChange={handleChange}>
                        <option value="Drip">Drip</option>
                        <option value="Sprinkler">Sprinkler</option>
                        <option value="Surface">Surface / Flood</option>
                        <option value="Rainfed">Rainfed (None)</option>
                    </select>

                    <div className="flex justify-end gap-2 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                        >
                            {loading ? 'Adding...' : 'Save Plot'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPlotModal;