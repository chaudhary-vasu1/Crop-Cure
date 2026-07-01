import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import PlotCard from '../components/PlotCard';
import AddPlotModal from '../components/AddPlotModal';
import DiagnoseModal from '../components/DiagnoseModal';
import IrrigationModal from '../components/IrrigationModal';
import { Plus, Info, LayoutGrid, Loader2 } from 'lucide-react';

const Farms = () => {
    const { language } = useContext(AppContext);
    
    // Translations mapping
    const t = {
        en: { 
            title: "My Farm Plots", 
            addPlot: "+ Add Plot", 
            loading: "Retrieving farm registry...", 
            empty: "You haven't added any plots yet.",
            confirmDelete: "Are you sure you want to delete this plot?",
            failedDelete: "Failed to delete plot"
        },
        es: {
            title: "Mis Parcelas de Campo",
            addPlot: "+ Añadir Parcela",
            loading: "Cargando sus parcelas...",
            empty: "Aún no ha añadido ninguna parcela.",
            confirmDelete: "¿Está seguro de que desea eliminar esta parcela?",
            failedDelete: "Error al eliminar la parcela"
        },
        hi: { 
            title: "मेरे खेत के प्लॉट", 
            addPlot: "+ प्लॉट जोड़ें", 
            loading: "आपके प्लॉट लोड हो रहे हैं...", 
            empty: "आपने अभी तक कोई प्लॉट नहीं जोड़ा है।",
            confirmDelete: "क्या आप वाकई इस प्लॉट को हटाना चाहते हैं?",
            failedDelete: "प्लॉट हटाने में विफल"
        }
    };
    const lang = t[language] || t.en;

    const [plots, setPlots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedPlotForDiagnosis, setSelectedPlotForDiagnosis] = useState(null);
    const [selectedPlotForIrrigation, setSelectedPlotForIrrigation] = useState(null);

    useEffect(() => {
        const fetchPlots = async () => {
            try {
                const response = await api.get('/plots');
                setPlots(response.data);
            } catch (error) {
                console.error('Error fetching plots:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlots();
    }, []);

    const handleDeletePlot = async (id) => {
        try {
            await api.delete(`/plots/${id}`);
            setPlots(plots.filter(plot => plot._id !== id));
        } catch (error) {
            console.error('Error deleting plot:', error);
            alert(lang.failedDelete);
        }
    };

    const handlePlotAdded = (newPlot) => {
        setPlots([newPlot, ...plots]);
    };

    return (
        <div className="w-full text-left animate-slide-up">
            {/* Plot Listings Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                        {lang.title}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                        Manage your crops, physical plots, and watering methods.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-3 font-extrabold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-md shadow-emerald-500/10 border-none cursor-pointer transition-all active:scale-[0.98] text-sm flex items-center gap-1.5 shrink-0"
                >
                    <Plus size={16} />
                    <span>{lang.addPlot}</span>
                </button>
            </div>

            {/* Plots Listing Grid */}
            {loading ? (
                <div className="flex flex-col justify-center items-center py-24 gap-3 text-slate-400 dark:text-slate-500">
                    <Loader2 size={36} className="animate-spin text-emerald-500" />
                    <p className="text-sm font-bold animate-pulse">{lang.loading}</p>
                </div>
            ) : plots.length === 0 ? (
                <div className="p-12 border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl w-full text-center shadow-lg shadow-slate-200/30 dark:shadow-black/40 flex flex-col items-center justify-center gap-5">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-gray-950 rounded-2xl flex items-center justify-center text-3xl shadow-inner select-none">
                        🚜
                    </div>
                    <div className="max-w-xs">
                        <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-200">No plots registered</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium leading-relaxed">{lang.empty}</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold border-none cursor-pointer transition shadow-sm active:scale-95"
                    >
                        Create Your First Plot
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {plots.map(plot => (
                        <PlotCard
                            key={plot._id}
                            plot={plot}
                            onDelete={handleDeletePlot}
                            onDiagnose={setSelectedPlotForDiagnosis}
                            onIrrigation={setSelectedPlotForIrrigation}
                        />
                    ))}
                </div>
            )}

            <AddPlotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPlotAdded={handlePlotAdded} />
            <DiagnoseModal isOpen={!!selectedPlotForDiagnosis} onClose={() => setSelectedPlotForDiagnosis(null)} plot={selectedPlotForDiagnosis} />
            <IrrigationModal isOpen={!!selectedPlotForIrrigation} onClose={() => setSelectedPlotForIrrigation(null)} plot={selectedPlotForIrrigation} />
        </div>
    );
};

export default Farms;
