import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import PlotCard from '../components/PlotCard';
import AddPlotModal from '../components/AddPlotModal';
import DiagnoseModal from '../components/DiagnoseModal';
import IrrigationModal from '../components/IrrigationModal';
import WeatherWidget from '../components/WeatherWidget';

const Dashboard = () => {
    // 1. Context for language
    const { language } = useContext(AppContext);
    
    // 2. Translations mapping
    const t = {
        en: { 
            title: "My Farm Plots", 
            addPlot: "+ Add Plot", 
            loading: "Loading your plots...", 
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

    // 3. Existing state
    const [plots, setPlots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedPlotForDiagnosis, setSelectedPlotForDiagnosis] = useState(null);
    const [selectedPlotForIrrigation, setSelectedPlotForIrrigation] = useState(null);

    // 4. Existing operations
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
        if (!window.confirm(lang.confirmDelete)) return;
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

    const defaultCity = plots.length > 0 && plots[0].location ? plots[0].location.split(',')[0].trim() : undefined;

    return (
        <div className="w-full text-left">
            <WeatherWidget defaultCity={defaultCity} />

            <div className="flex justify-between items-center mb-6 mt-8">
                <h2 className="text-2xl font-extrabold text-gray-850 dark:text-white">{lang.title}</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 font-bold text-white bg-green-600 hover:bg-green-700 transition rounded-xl shadow-md border-none cursor-pointer"
                >
                    {lang.addPlot}
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 font-semibold animate-pulse">{lang.loading}</p>
                </div>
            ) : plots.length === 0 ? (
                <div className="p-12 border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl w-full text-center shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{lang.empty}</p>
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

export default Dashboard;