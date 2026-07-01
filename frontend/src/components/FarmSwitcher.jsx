import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { Layers, Plus, X, Loader2 } from 'lucide-react';

const FarmSwitcher = () => {
    const { farms, selectedFarm, changeSelectedFarm, refreshFarms, language } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newFarm, setNewFarm] = useState({
        name: '',
        location: '',
        size: '',
        crops: ''
    });

    const t = {
        en: {
            allFarms: "All Farms",
            selectFarm: "Select Active Farm",
            addFarm: "Add Farm",
            nameLabel: "Farm Name",
            locLabel: "Location (City/Region)",
            sizeLabel: "Size (Acres)",
            cropsLabel: "Crops Grown (comma separated)",
            btnCreate: "Create Farm",
            btnCancel: "Cancel",
            creating: "Creating...",
            totalCrops: "Crops:",
            acres: "Acres"
        },
        es: {
            allFarms: "Todos los Campos",
            selectFarm: "Seleccionar Campo Activo",
            addFarm: "Añadir Campo",
            nameLabel: "Nombre del Campo",
            locLabel: "Ubicación (Ciudad/Región)",
            sizeLabel: "Tamaño (Acres)",
            cropsLabel: "Cultivos (separados por comas)",
            btnCreate: "Crear Campo",
            btnCancel: "Cancelar",
            creating: "Creando...",
            totalCrops: "Cultivos:",
            acres: "Acres"
        },
        hi: {
            allFarms: "सभी खेत",
            selectFarm: "सक्रिय खेत चुनें",
            addFarm: "खेत जोड़ें",
            nameLabel: "खेत का नाम",
            locLabel: "स्थान (शहर/क्षेत्र)",
            sizeLabel: "क्षेत्रफल (एकड़)",
            cropsLabel: "उगाई जाने वाली फसलें (कोमा से अलग करें)",
            btnCreate: "खेत बनाएं",
            btnCancel: "रद्द करें",
            creating: "बनाया जा रहा है...",
            totalCrops: "फसलें:",
            acres: "एकड़"
        }
    };
    const lang = t[language] || t.en;

    const handleCreateFarm = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const cropList = newFarm.crops
                ? newFarm.crops.split(',').map(c => c.trim()).filter(Boolean)
                : [];
            
            await api.post('/farms', {
                name: newFarm.name,
                location: newFarm.location,
                size: Number(newFarm.size || 1),
                crops: cropList
            });

            setIsAddOpen(false);
            setNewFarm({ name: '', location: '', size: '', crops: '' });
            await refreshFarms();
        } catch (err) {
            console.error("Error creating farm:", err);
            alert(err.response?.data?.message || 'Failed to create farm');
        } finally {
            setLoading(false);
        }
    };

    const activeFarmObj = farms.find(f => f._id === selectedFarm);

    return (
        <div className="relative">
            {/* Display / Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100/80 dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800 rounded-2xl text-xs font-bold text-slate-750 dark:text-slate-250 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-gray-800 transition"
            >
                <Layers size={14} className="text-emerald-500" />
                <span>{activeFarmObj ? activeFarmObj.name : lang.allFarms}</span>
                <span className="text-[10px] opacity-60">▼</span>
            </button>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-white dark:bg-gray-905 border border-slate-200/60 dark:border-gray-800 rounded-3xl shadow-xl z-50 p-2 animate-scale-in text-left">
                    <p className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500 tracking-wider px-3 py-2 border-b border-slate-100 dark:border-gray-800">
                        {lang.selectFarm}
                    </p>

                    <div className="max-h-56 overflow-y-auto py-1 space-y-0.5">
                        <button
                            onClick={() => {
                                changeSelectedFarm('all');
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer border-none flex flex-col transition ${
                                selectedFarm === 'all'
                                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-transparent text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-gray-850'
                            }`}
                        >
                            <span className="font-extrabold">{lang.allFarms}</span>
                            <span className="text-[9px] opacity-60 mt-0.5">Show data across all registered fields</span>
                        </button>

                        {farms.map((farm) => (
                            <button
                                key={farm._id}
                                onClick={() => {
                                    changeSelectedFarm(farm._id);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer border-none flex flex-col transition ${
                                    selectedFarm === farm._id
                                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-transparent text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-gray-850'
                                }`}
                            >
                                <span className="font-extrabold">{farm.name}</span>
                                <span className="text-[9px] opacity-60 mt-0.5">
                                    {farm.location} • {farm.size} {lang.acres}
                                </span>
                                {farm.crops.length > 0 && (
                                    <span className="text-[8px] font-bold mt-1 text-slate-450 dark:text-slate-500">
                                        {lang.totalCrops} {farm.crops.join(', ')}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            setIsAddOpen(true);
                            setIsOpen(false);
                        }}
                        className="w-full mt-1.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold border-none cursor-pointer flex items-center justify-center gap-1.5 transition"
                    >
                        <Plus size={13} />
                        {lang.addFarm}
                    </button>
                </div>
            )}

            {/* Add Farm Dialog Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fade-in text-left">
                    <div className="w-full max-w-sm bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl p-6 shadow-2xl animate-scale-in">
                        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-gray-800">
                            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                🚜 {lang.addFarm}
                            </h3>
                            <button
                                onClick={() => setIsAddOpen(false)}
                                className="p-1 bg-transparent border-none cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg text-slate-400"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateFarm} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                                    {lang.nameLabel}
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Rice Valley Farm"
                                    value={newFarm.name}
                                    onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-medium text-slate-800 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                                    {lang.locLabel}
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Meerut, Uttar Pradesh"
                                    value={newFarm.location}
                                    onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-medium text-slate-800 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                                        {lang.sizeLabel}
                                    </label>
                                    <input
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        placeholder="e.g. 2.5"
                                        value={newFarm.size}
                                        onChange={(e) => setNewFarm({ ...newFarm, size: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-medium text-slate-800 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                                        {lang.cropsLabel}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Wheat, Rice"
                                        value={newFarm.crops}
                                        onChange={(e) => setNewFarm({ ...newFarm, crops: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-medium text-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-white rounded-xl text-xs font-bold border-none cursor-pointer transition"
                                >
                                    {lang.btnCancel}
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white rounded-xl text-xs font-bold border-none cursor-pointer transition flex items-center justify-center gap-1.5"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={13} className="animate-spin" />
                                            <span>{lang.creating}</span>
                                        </>
                                    ) : (
                                        lang.btnCreate
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmSwitcher;
