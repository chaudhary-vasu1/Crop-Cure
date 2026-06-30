import { useState } from 'react';
import api from '../utils/api'; // Your custom axios setup!

const AddPlotModal = ({ isOpen, onClose, onPlotAdded }) => {
    const [name, setName] = useState('');
    const [cropType, setCropType] = useState('');
    const [area, setArea] = useState('');
    const [location, setLocation] = useState('Meerut');
    const [soilType, setSoilType] = useState('Loamy');
    const [irrigationMethod, setIrrigationMethod] = useState('Drip');
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
                area: Number(area),
                location,
                soilType,
                irrigationMethod
            });
            
            onPlotAdded(response.data); // Updates the UI instantly!
            
            // Reset form and close
            setName(''); 
            setCropType(''); 
            setArea('');
            setLocation('Meerut');
            setSoilType('Loamy');
            setIrrigationMethod('Drip');
            onClose();
        } catch (error) {
            console.error("Failed to add plot:", error);
            alert("Error saving plot. Check your backend logs!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl transition-all duration-300">
                <h2 className="mb-4 text-2xl font-bold text-green-700 dark:text-green-500">Add New Plot</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide text-left">Plot Name (e.g., North Field)</label>
                        <input 
                            type="text" required value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 mt-1 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide text-left">Crop Type (e.g., Wheat, Corn)</label>
                        <input 
                            type="text" required value={cropType} onChange={(e) => setCropType(e.target.value)}
                            className="w-full p-2 mt-1 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide text-left">Area (acres)</label>
                            <input 
                                type="number" required min="0.1" step="0.1" value={area} onChange={(e) => setArea(e.target.value)}
                                className="w-full p-2 mt-1 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide text-left">Location/City</label>
                            <input 
                                type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-2 mt-1 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide text-left">Soil Type</label>
                            <select 
                                value={soilType} onChange={(e) => setSoilType(e.target.value)}
                                className="w-full p-2 mt-1 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                            >
                                <option value="Loamy">Loamy</option>
                                <option value="Clay">Clay</option>
                                <option value="Sandy">Sandy</option>
                                <option value="Silt">Silt</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide text-left">Irrigation Method</label>
                            <select 
                                value={irrigationMethod} onChange={(e) => setIrrigationMethod(e.target.value)}
                                className="w-full p-2 mt-1 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                            >
                                <option value="Drip">Drip</option>
                                <option value="Sprinkler">Sprinkler</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition shadow-md">
                            {loading ? 'Saving...' : 'Save Plot'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPlotModal;