import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AppContext } from '../context/AppContext';
import { ShieldAlert, CheckCircle, Search, Clock, Leaf, FlaskConical, AlertTriangle, Loader2 } from 'lucide-react';

const Crops = () => {
    const [diagnoses, setDiagnoses] = useState([]);
    const [plots, setPlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); // All, Healthy, Sick, Contagious

    const { language } = useContext(AppContext);

    // Translations mapping
    const t = {
        en: {
            title: "Crop Doctor Analytics",
            subtitle: "Historical health records, diagnosis tracking, and AI-recommended treatment plans.",
            loading: "Loading diagnostic logs...",
            statsTotal: "Total Tests",
            statsHealthy: "Healthy Crops",
            statsSick: "Sick / Deficient",
            statsContagious: "Contagious Alerts",
            searchPlaceholder: "Search by plot, disease, or crop type...",
            emptyLogs: "No logs found",
            emptyLogsDesc: "No diagnostic records match the selected filter parameters.",
            aiConfidence: "AI Confidence",
            organicCure: "Organic Cure",
            chemicalCure: "Chemical Cure",
            healthyNotice: "🎉 No treatment necessary. Your crop shows healthy leaves!",
            cropUnspecified: "Crop unspecified",
            deletedPlot: "Deleted Plot",
            all: "All",
            healthy: "Healthy",
            sick: "Sick",
            contagious: "Contagious",
            contagiousText: "Contagious"
        },
        es: {
            title: "Análisis del Doctor de Cultivos",
            subtitle: "Registros históricos de salud, seguimiento de diagnósticos y planes de tratamiento recomendados por IA.",
            loading: "Cargando registros de diagnóstico...",
            statsTotal: "Pruebas Totales",
            statsHealthy: "Cultivos Sanos",
            statsSick: "Enfermos / Deficientes",
            statsContagious: "Alertas de Contagio",
            searchPlaceholder: "Buscar por parcela, enfermedad o tipo de cultivo...",
            emptyLogs: "No se encontraron registros",
            emptyLogsDesc: "Ningún registro de diagnóstico coincide con los parámetros seleccionados.",
            aiConfidence: "Confianza de IA",
            organicCure: "Remedio Orgánico",
            chemicalCure: "Remedio Químico",
            healthyNotice: "🎉 Riego y cuidado regular. ¡Sus cultivos están completamente sanos!",
            cropUnspecified: "Cultivo no especificado",
            deletedPlot: "Parcela Eliminada",
            all: "Todo",
            healthy: "Sano",
            sick: "Enfermo",
            contagious: "Contagioso",
            contagiousText: "Contagioso"
        },
        hi: {
            title: "फसल डॉक्टर विश्लेषण",
            subtitle: "ऐतिहासिक स्वास्थ्य रिकॉर्ड, निदान ट्रैकिंग, और एआई-अनुशंसित उपचार योजनाएं।",
            loading: "निदान लॉग लोड हो रहे हैं...",
            statsTotal: "कुल परीक्षण",
            statsHealthy: "स्वस्थ फसलें",
            statsSick: "बीमार / कमी",
            statsContagious: "संक्रामक अलर्ट",
            searchPlaceholder: "प्लॉट, बीमारी या फसल के प्रकार से खोजें...",
            emptyLogs: "कोई लॉग नहीं मिला",
            emptyLogsDesc: "चयनित फ़िल्टर मापदंडों से कोई भी नैदानिक ​​रिकॉर्ड मेल नहीं खाता है।",
            aiConfidence: "एआई आत्मविश्वास",
            organicCure: "जैविक उपचार",
            chemicalCure: "रासायनिक उपचार",
            healthyNotice: "🎉 किसी उपचार की आवश्यकता नहीं है। आपकी फसल स्वस्थ पत्ते दिखाती है!",
            cropUnspecified: "फसल निर्दिष्ट नहीं",
            deletedPlot: "हटाया गया प्लॉट",
            all: "सभी",
            healthy: "स्वस्थ",
            sick: "बीमार",
            contagious: "संक्रामक",
            contagiousText: "संक्रामक"
        }
    };
    const lang = t[language] || t.en;

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
        <div className="max-w-6xl mx-auto mt-6 px-4 pb-12 animate-slide-up text-left">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/10 shrink-0 select-none">
                            🌾
                        </div>
                        <span>{lang.title}</span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        {lang.subtitle}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-450 dark:text-slate-500">
                    <Loader2 size={36} className="animate-spin text-emerald-500" />
                    <p className="text-sm font-bold animate-pulse">{lang.loading}</p>
                </div>
            ) : (
                <>
                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-gray-990 p-5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-gray-850 flex items-center gap-4 hover:-translate-y-0.5 transition duration-300">
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-405 dark:text-gray-500 font-bold uppercase tracking-wider">{lang.statsTotal}</p>
                                <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{totalDiagnoses}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-990 p-5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-gray-855 flex items-center gap-4 hover:-translate-y-0.5 transition duration-300">
                            <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-xl">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-405 dark:text-gray-500 font-bold uppercase tracking-wider">{lang.statsHealthy}</p>
                                <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{healthyCount}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-990 p-5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-gray-855 flex items-center gap-4 hover:-translate-y-0.5 transition duration-300">
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 rounded-xl">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-405 dark:text-gray-500 font-bold uppercase tracking-wider">{lang.statsSick}</p>
                                <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{sickCount}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-990 p-5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-gray-855 flex items-center gap-4 hover:-translate-y-0.5 transition duration-300">
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 rounded-xl">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-405 dark:text-gray-500 font-bold uppercase tracking-wider">{lang.statsContagious}</p>
                                <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{contagiousCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between bg-white dark:bg-gray-90 gap-3 p-4 rounded-2xl border border-slate-200/50 dark:border-gray-800/50 shadow-sm mb-8">
                        {/* Search */}
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 px-3.5 py-2.5 rounded-xl w-full md:max-w-md">
                            <Search className="text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder={lang.searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none w-full border-none"
                            />
                        </div>

                        {/* Status Tabs */}
                        <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-gray-950 p-1 rounded-xl border border-slate-200/20 dark:border-gray-800/20">
                            {[
                                { filter: 'All', name: lang.all },
                                { filter: 'Healthy', name: lang.healthy },
                                { filter: 'Sick', name: lang.sick },
                                { filter: 'Contagious', name: lang.contagious }
                            ].map((item) => (
                                <button
                                    key={item.filter}
                                    onClick={() => setStatusFilter(item.filter)}
                                    className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all duration-200 border-none cursor-pointer ${
                                        statusFilter === item.filter
                                            ? 'bg-white dark:bg-gray-850 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                            : 'text-slate-650 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-gray-900/50'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Diagnoses History List */}
                    {filteredDiagnoses.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 p-16 text-center rounded-3xl shadow-lg shadow-slate-200/30 dark:shadow-black/40 flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-gray-950 rounded-2xl flex items-center justify-center text-3xl shadow-inner select-none">
                                🍃
                            </div>
                            <div className="max-w-xs">
                                <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-200">{lang.emptyLogs}</h4>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-medium leading-relaxed">{lang.emptyLogsDesc}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredDiagnoses.map((diag) => {
                                const isHealthy = diag.diseaseName.toLowerCase() === 'healthy';
                                const formattedDate = new Date(diag.createdAt).toLocaleDateString(
                                    language === 'hi' ? 'hi-IN' : language === 'es' ? 'es-ES' : 'en-US', 
                                    {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }
                                );

                                return (
                                    <div 
                                        key={diag._id} 
                                        className="bg-white dark:bg-gray-905 border border-slate-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden text-left"
                                    >
                                        {/* Card Top Title Banner */}
                                        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-955/20">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-850 dark:text-slate-100 tracking-tight">
                                                    {diag.plot?.name || lang.deletedPlot}
                                                </h3>
                                                <div className="flex items-center gap-2.5 mt-1.5 font-bold">
                                                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-md uppercase tracking-wider border border-emerald-100/10">
                                                        {diag.plot?.cropType || lang.cropUnspecified}
                                                    </span>
                                                    {diag.plot?.location && (
                                                        <span className="text-xs text-slate-400 dark:text-slate-550 flex items-center gap-1 font-semibold">
                                                            📍 {diag.plot.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-left sm:text-right flex flex-col sm:items-end gap-1">
                                                <p className="text-xs text-slate-400 dark:text-slate-550 font-bold">{formattedDate}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                                        isHealthy 
                                                            ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200/20' 
                                                            : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200/20'
                                                    }`}>
                                                        {diag.diseaseName}
                                                    </span>
                                                    {diag.isContagious && (
                                                        <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 animate-pulse shadow-sm">
                                                            <ShieldAlert size={10} /> {lang.contagiousText}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6">
                                            {/* AI Confidence Meter */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-full bg-slate-100 dark:bg-gray-950 h-2 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            isHealthy ? 'bg-emerald-500' : 'bg-orange-500'
                                                        }`}
                                                        style={{ width: `${diag.confidenceScore * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-extrabold text-slate-450 dark:text-slate-500 shrink-0">
                                                    {lang.aiConfidence}: {Math.round(diag.confidenceScore * 100)}%
                                                </span>
                                            </div>

                                            {/* Treatments Grid */}
                                            {!isHealthy && diag.treatmentPlan && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Organic Treatment */}
                                                    <div className="p-5 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-950/50 rounded-2xl text-left">
                                                        <h4 className="font-extrabold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                            <Leaf size={14} className="text-emerald-500" /> {lang.organicCure}
                                                        </h4>
                                                        <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-semibold">
                                                            {diag.treatmentPlan.organic || 'No organic treatment specified.'}
                                                        </p>
                                                    </div>

                                                    {/* Chemical Treatment */}
                                                    <div className="p-5 bg-purple-50/20 dark:bg-purple-950/10 border border-purple-100/50 dark:border-purple-950/50 rounded-2xl text-left">
                                                        <h4 className="font-extrabold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                            <FlaskConical size={14} className="text-purple-500" /> {lang.chemicalCure}
                                                        </h4>
                                                        <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-semibold">
                                                            {diag.treatmentPlan.chemical || 'No chemical treatment specified.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {isHealthy && (
                                                <div className="text-center py-4 bg-emerald-50/10 dark:bg-emerald-950/5 border border-emerald-100/30 dark:border-emerald-950/30 rounded-xl">
                                                    <p className="text-xs text-emerald-705 dark:text-emerald-400 font-extrabold flex items-center justify-center gap-1.5">
                                                        {lang.healthyNotice}
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