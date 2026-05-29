import { useState } from 'react';
import api from '../utils/api'; // Your custom axios setup!

const AddPlotModal = ({ isOpen, onClose, onPlotAdded }) => {
    const [name, setName] = useState('');
    const [cropType, setCropType] = useState('');
    const [area, setArea] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // This sends the new plot to your Render backend
            const response = await api.post('/plots', { 
                name, 
                cropType, 
                area: Number(area) 
            });
            
            onPlotAdded(response.data); // Updates the UI instantly!
            
            // Reset form and close
            setName(''); setCropType(''); setArea('');
            onClose();
        } catch (error) {
            console.error("Failed to add plot:", error);
            alert("Error saving plot. Check your backend logs!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-2xl font-bold text-green-700">Add New Plot</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Plot Name (e.g., North Field)</label>
                        <input 
                            type="text" required value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 mt-1 border rounded focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Crop Type (e.g., Wheat, Corn)</label>
                        <input 
                            type="text" required value={cropType} onChange={(e) => setCropType(e.target.value)}
                            className="w-full p-2 mt-1 border rounded focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Area (in acres)</label>
                        <input 
                            type="number" required min="0.1" step="0.1" value={area} onChange={(e) => setArea(e.target.value)}
                            className="w-full p-2 mt-1 border rounded focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700">
                            {loading ? 'Saving...' : 'Save Plot'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPlotModal;