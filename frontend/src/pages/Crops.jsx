import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Sprout, ShieldAlert, CheckCircle, Search, Filter, Clock, Leaf, FlaskConical, AlertTriangle } from 'lucide-react';

const Crops = () => {
    const [diagnoses, setDiagnoses] = useState([]);
    const [plots, setPlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); // All, Healthy, Sick, Contagious

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [diagRes, plotsRes] = await Promise.all([
                    api.get('/diagnostics'),
                    api.get('/plots')
                ]);
                setDiagnoses(diagRes.data);
                setPlots(plotsRes.data);
            } catch (error) {
                console.error("Error loading analytics data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter logic
    const filteredDiagnoses = diagnoses.filter(diag => {
        const matchesSearch = 
            (diag.plot?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (diag.diseaseName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (diag.plot?.cropType || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        if (statusFilter === 'All') return matchesSearch;
        if (statusFilter === 'Healthy') return matchesSearch && diag.diseaseName.toLowerCase() === 'healthy';
        if (statusFilter === 'Sick') return matchesSearch && diag.diseaseName.toLowerCase() !== 'healthy';
        if (statusFilter === 'Contagious') return matchesSearch && diag.isContagious;
        
        return matchesSearch;
    });

    // Stats calculations
    const totalDiagnoses = diagnoses.length;
    const healthyCount = diagnoses.filter(d => d.diseaseName.toLowerCase() === 'healthy').length;
    const contagiousCount = diagnoses.filter(d => d.isContagious).length;
    const sickCount = totalDiagnoses - healthyCount;

    return (
        <div className="max-w-6xl mx-auto mt-6 px-4 pb-12 transition-colors duration-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="text-left">
                    <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
                        <Sprout className="text-green-600 dark:text-green-500" size={32} />
                        Crop Doctor Analytics
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Historical health records, diagnosis tracking, and AI-recommended treatment plans.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    <p className="text-green-600 dark:text-green-400 font-semibold animate-pulse">Loading diagnostic logs...</p>
                </div>
            ) : (
                <>
                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left">
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all duration-300">
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Total Tests</p>
                                <p className="text-2xl font-black text-gray-800 dark:text-white mt-0.5">{totalDiagnoses}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all duration-300">
                            <div className="p-3 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-xl">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Healthy Crops</p>
                                <p className="text-2xl font-black text-gray-800 dark:text-white mt-0.5">{healthyCount}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all duration-300">
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400 rounded-xl">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Diseased/Deficient</p>
                                <p className="text-2xl font-black text-gray-800 dark:text-white mt-0.5">{sickCount}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all duration-300">
                            <div className="p-3 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-xl">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Contagious Alerts</p>
                                <p className="text-2xl font-black text-gray-800 dark:text-white mt-0.5">{contagiousCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-6 transition-all duration-300">
                        {/* Search */}
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-2 rounded-xl w-full md:max-w-md transition-all duration-300">
                            <Search className="text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by plot, disease, or crop type..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none w-full"
                            />
                        </div>

                        {/* Status Tabs */}
                        <div className="flex flex-wrap gap-1">
                            {['All', 'Healthy', 'Sick', 'Contagious'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(filter)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                                        statusFilter === filter
                                            ? 'bg-green-600 text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Diagnoses History List */}
                    {filteredDiagnoses.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-12 text-center rounded-2xl shadow-sm transition-all duration-300">
                            <Sprout className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                            <p className="text-gray-500 dark:text-gray-400 font-semibold">No diagnostic records found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredDiagnoses.map((diag) => {
                                const isHealthy = diag.diseaseName.toLowerCase() === 'healthy';
                                const formattedDate = new Date(diag.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });

                                return (
                                    <div 
                                        key={diag._id} 
                                        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden text-left"
                                    >
                                        {/* Card Top Title Banner */}
                                        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/10">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                                    {diag.plot?.name || 'Deleted Plot'}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-semibold px-2 py-0.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-md">
                                                        {diag.plot?.cropType || 'Crop unspecified'}
                                                    </span>
                                                    {diag.plot?.location && (
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            📍 {diag.plot.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-left sm:text-right">
                                                <p className="text-xs text-gray-400 dark:text-gray-500">{formattedDate}</p>
                                                <div className="flex items-center gap-2 mt-1.5 sm:justify-end">
                                                    <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                                        isHealthy 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300' 
                                                            : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300'
                                                    }`}>
                                                        {diag.diseaseName}
                                                    </span>
                                                    {diag.isContagious && (
                                                        <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                                            <ShieldAlert size={10} /> Contagious
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6">
                                            {/* AI Confidence Meter */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-full bg-gray-100 dark:bg-gray-900 h-2.5 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            isHealthy ? 'bg-green-500' : 'bg-orange-500'
                                                        }`}
                                                        style={{ width: `${diag.confidenceScore * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0">
                                                    AI Confidence: {Math.round(diag.confidenceScore * 100)}%
                                                </span>
                                            </div>

                                            {/* Treatments Grid */}
                                            {!isHealthy && diag.treatmentPlan && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Organic Treatment */}
                                                    <div className="p-4 bg-green-50/20 dark:bg-green-950/10 border border-green-100 dark:border-green-950/50 rounded-xl">
                                                        <h4 className="font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2 text-sm">
                                                            <Leaf size={16} /> Organic Cure
                                                        </h4>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                            {diag.treatmentPlan.organic || 'No organic treatment specified.'}
                                                        </p>
                                                    </div>

                                                    {/* Chemical Treatment */}
                                                    <div className="p-4 bg-purple-50/20 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-950/50 rounded-xl">
                                                        <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2 text-sm">
                                                            <FlaskConical size={16} /> Chemical Cure
                                                        </h4>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                            {diag.treatmentPlan.chemical || 'No chemical treatment specified.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {isHealthy && (
                                                <div className="text-center py-4 bg-green-50/20 dark:bg-green-950/5 border border-green-100 dark:border-green-950/30 rounded-xl">
                                                    <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
                                                        🎉 No treatment necessary. Your crop shows healthy leaves!
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Crops;