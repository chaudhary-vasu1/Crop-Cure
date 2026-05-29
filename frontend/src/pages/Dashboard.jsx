import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import PlotCard from '../components/PlotCard';
import AddPlotModal from '../components/AddPlotModal';
import DiagnoseModal from '../components/DiagnoseModal';
import IrrigationModal from '../components/IrrigationModal';
import WeatherWidget from '../components/WeatherWidget'; // ✅ NEW: Imported the widget

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [plots, setPlots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [selectedPlotForDiagnosis, setSelectedPlotForDiagnosis] = useState(null);
    const [selectedPlotForIrrigation, setSelectedPlotForIrrigation] = useState(null);

    // Fetch plots when dashboard loads
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

    // Delete plot
    const handleDeletePlot = async (id) => {
        if (!window.confirm('Are you sure you want to delete this plot?')) return;

        try {
            await api.delete(`/plots/${id}`);
            setPlots(plots.filter(plot => plot._id !== id));
        } catch (error) {
            console.error('Error deleting plot:', error);
            alert('Failed to delete plot');
        }
    };

    // Add new plot
    const handlePlotAdded = (newPlot) => {
        setPlots([newPlot, ...plots]);
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="p-4 text-white bg-green-700 shadow-md">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <h1 className="text-xl font-bold">🌾 AI Crop Doctor</h1>
                    <div className="flex items-center gap-4">
                        <span>Welcome, {user?.username}</span>
                        <button
                            onClick={logout}
                            className="px-3 py-1 text-sm bg-green-800 rounded hover:bg-green-900"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl p-4 mx-auto mt-8">
                
                {/* ✅ NEW: Weather Widget is now rendering at the very top of the dashboard */}
                <WeatherWidget />

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        My Farm Plots
                    </h2>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 font-bold text-white bg-green-600 rounded shadow-sm hover:bg-green-700"
                    >
                        + Add Plot
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-600">Loading your plots...</p>
                ) : plots.length === 0 ? (
                    <div className="p-8 text-center bg-white border border-gray-200 rounded-lg">
                        <p className="text-gray-500">
                            You haven't added any plots yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {plots.map(plot => (
                            <PlotCard
                                key={plot._id}
                                plot={plot}
                                onDelete={handleDeletePlot}
                                onDiagnose={(selectedPlot) =>
                                    setSelectedPlotForDiagnosis(selectedPlot)
                                }
                                onIrrigation={(selectedPlot) =>
                                    setSelectedPlotForIrrigation(selectedPlot)
                                }
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Modals */}
            <AddPlotModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPlotAdded={handlePlotAdded}
            />

            <DiagnoseModal
                isOpen={!!selectedPlotForDiagnosis}
                onClose={() => setSelectedPlotForDiagnosis(null)}
                plot={selectedPlotForDiagnosis}
            />

            <IrrigationModal
                isOpen={!!selectedPlotForIrrigation}
                onClose={() => setSelectedPlotForIrrigation(null)}
                plot={selectedPlotForIrrigation}
            />
        </div>
    );
};

export default Dashboard;