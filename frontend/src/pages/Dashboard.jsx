import { useState, useEffect } from 'react';
import api from '../utils/api';
import PlotCard from '../components/PlotCard';
import AddPlotModal from '../components/AddPlotModal';
import DiagnoseModal from '../components/DiagnoseModal';
import IrrigationModal from '../components/IrrigationModal';
import WeatherWidget from '../components/WeatherWidget'; 

const Dashboard = () => {
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
        if (!window.confirm('Are you sure you want to delete this plot?')) return;
        try {
            await api.delete(`/plots/${id}`);
            setPlots(plots.filter(plot => plot._id !== id));
        } catch (error) {
            console.error('Error deleting plot:', error);
            alert('Failed to delete plot');
        }
    };

    const handlePlotAdded = (newPlot) => {
        setPlots([newPlot, ...plots]);
    };

    return (
        <div style={{ width: '100%' }}>
            <WeatherWidget />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Farm Plots</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ padding: '0.5rem 1rem', fontWeight: 'bold', color: 'white', backgroundColor: '#059669', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}
                >
                    + Add Plot
                </button>
            </div>

            {loading ? (
                <p>Loading your plots...</p>
            ) : plots.length === 0 ? (
                <div style={{ padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', width: '100%', textAlign: 'center' }}>
                    <p>You haven't added any plots yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', width: '100%' }}>
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