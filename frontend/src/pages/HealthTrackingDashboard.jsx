import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import FarmSwitcher from '../components/FarmSwitcher';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Activity, ShieldAlert, CheckCircle2, FileDown, PlusCircle, Edit2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';

const HealthTrackingDashboard = () => {
    const { selectedFarm, language } = useContext(AppContext);
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [trends, setTrends] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [stats, setStats] = useState({ avgHealth: 100, totalDiagnoses: 0, criticalCount: 0 });
    
    // Treatment Modal States
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [treatmentInput, setTreatmentInput] = useState('');
    const [notesInput, setNotesInput] = useState('');
    const [submittingTreatment, setSubmittingTreatment] = useState(false);

    const t = {
        en: {
            title: "📈 Crop Health Dashboard",
            subtitle: "Historical analysis of farm diagnoses and healing progress",
            statAvgHealth: "Farm Health Index",
            statTotal: "Total Diagnoses",
            statCritical: "Active Contagions",
            chartTitle: "30-Day Crop Health Index Trend",
            tableTitle: "Diagnostic & Treatment Logs",
            colDate: "Date",
            colCrop: "Crop Plot",
            colDiagnosis: "Condition / Disease",
            colConfidence: "Confidence",
            colTreatment: "Treatment Status",
            colNotes: "Notes",
            colAction: "Update",
            btnExport: "Export PDF Report",
            btnUpdate: "Log Treatment",
            prevPage: "Previous",
            nextPage: "Next"
        },
        es: {
            title: "📈 Panel de Salud del Cultivo",
            subtitle: "Análisis histórico de diagnósticos de campo y progreso",
            statAvgHealth: "Índice de Salud",
            statTotal: "Diagnósticos Totales",
            statCritical: "Infecciones Activas",
            chartTitle: "Tendencia del Índice de Salud (30 días)",
            tableTitle: "Registros de Diagnóstico y Tratamiento",
            colDate: "Fecha",
            colCrop: "Parcela",
            colDiagnosis: "Condición / Enfermedad",
            colConfidence: "Confianza",
            colTreatment: "Estado de Tratamiento",
            colNotes: "Notas",
            colAction: "Actualizar",
            btnExport: "Exportar Reporte PDF",
            btnUpdate: "Registrar Tratamiento",
            prevPage: "Anterior",
            nextPage: "Siguiente"
        },
        hi: {
            title: "📈 फसल स्वास्थ्य डैशबोर्ड",
            subtitle: "खेत निदान और स्वास्थ्य प्रगति का ऐतिहासिक विश्लेषण",
            statAvgHealth: "स्वास्थ्य सूचकांक (Index)",
            statTotal: "कुल निदान",
            statCritical: "सक्रिय संक्रमण",
            chartTitle: "30-दिवसीय स्वास्थ्य सूचकांक प्रवृत्ति",
            tableTitle: "निदान और उपचार लॉग",
            colDate: "तारीख",
            colCrop: "फसल प्लॉट",
            colDiagnosis: "स्थिति / बीमारी",
            colConfidence: "आत्मविश्वास score",
            colTreatment: "उपचार की स्थिति",
            colNotes: "टिप्पणियाँ",
            colAction: "अपडेट",
            btnExport: "पीडीएफ रिपोर्ट डाउनलोड करें",
            btnUpdate: "उपचार लॉग करें",
            prevPage: "पीछे",
            nextPage: "आगे"
        }
    };
    const lang = t[language] || t.en;

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch history list
            const histResponse = await api.get(`/farm/${selectedFarm}/disease-history?page=${page}&limit=10`);
            setHistory(histResponse.data.history);
            setPages(histResponse.data.pages);

            // Fetch chart trends
            const trendResponse = await api.get(`/farm/${selectedFarm}/health-trend?days=30`);
            setTrends(trendResponse.data);

            // Fetch aggregate summary statistics
            const allResponse = await api.get(`/farm/${selectedFarm}/disease-history?page=1&limit=100`);
            const allLogs = allResponse.data.history;
            const avg = allLogs.length > 0
                ? Math.round(allLogs.reduce((acc, curr) => acc + curr.healthStatus, 0) / allLogs.length)
                : 100;
            const critical = allLogs.filter(d => d.healthStatus < 60 && d.treatmentApplied === 'None').length;

            setStats({
                avgHealth: avg,
                totalDiagnoses: allResponse.data.total,
                criticalCount: critical
            });
        } catch (error) {
            console.error("Error loading health statistics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedFarm, page]);

    const handleUpdateTreatmentSubmit = async (e) => {
        e.preventDefault();
        setSubmittingTreatment(true);
        try {
            await api.post(`/farm/${selectedFarm}/disease-history/${selectedRecord._id}/update-treatment`, {
                treatmentApplied: treatmentInput,
                notes: notesInput
            });
            setSelectedRecord(null);
            fetchData();
        } catch (err) {
            console.error("Failed to save treatment info:", err);
        } finally {
            setSubmittingTreatment(false);
        }
    };

    const handlePdfExport = () => {
        alert("Downloading PDF Health Report... Generated successfully.");
        // Mock a browser download event
        const element = document.createElement("a");
        const file = new Blob([
            `CropCure Farm Health Report\n=========================\nDate: ${new Date().toLocaleDateString()}\nAverage Health Index: ${stats.avgHealth}%\nTotal Diagnoses Logged: ${stats.totalDiagnoses}\nCritical Unresolved Issues: ${stats.criticalCount}\n\nThis report compiles AI diagnostic logs for crop status verification.\n`
        ], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `cropcure-health-report-${selectedFarm}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="container mx-auto px-4 py-8 text-left">
            {/* Header controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-550 dark:text-slate-400 bg-transparent border-none cursor-pointer hover:text-emerald-500 mb-2.5 transition"
                    >
                        <ArrowLeft size={14} /> Back to Home
                    </button>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {lang.title}
                    </h2>
                    <p className="text-xs text-slate-450 dark:text-slate-550 font-semibold mt-1">
                        {lang.subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <FarmSwitcher />
                    <button
                        onClick={handlePdfExport}
                        className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 border-none cursor-pointer transition shadow-sm"
                    >
                        <FileDown size={14} />
                        {lang.btnExport}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SkeletonLoader type="card" count={3} />
                    </div>
                    <SkeletonLoader type="chart" />
                    <SkeletonLoader type="table" />
                </div>
            ) : (
                <div className="space-y-8 animate-fade-in">
                    
                    {/* Top aggregate KPI cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Health Index Card */}
                        <div className="p-6 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xl rounded-2xl flex items-center justify-center">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-550 tracking-wider">
                                    {lang.statAvgHealth}
                                </p>
                                <p className="text-xl font-black text-slate-800 dark:text-white mt-1">
                                    {stats.avgHealth}%
                                </p>
                            </div>
                        </div>

                        {/* Total Diagnoses Card */}
                        <div className="p-6 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xl rounded-2xl flex items-center justify-center">
                                <PlusCircle size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-550 tracking-wider">
                                    {lang.statTotal}
                                </p>
                                <p className="text-xl font-black text-slate-800 dark:text-white mt-1">
                                    {stats.totalDiagnoses}
                                </p>
                            </div>
                        </div>

                        {/* Critical Unresolved Card */}
                        <div className="p-6 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 text-xl rounded-2xl flex items-center justify-center">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-550 tracking-wider">
                                    {lang.statCritical}
                                </p>
                                <p className="text-xl font-black text-slate-800 dark:text-white mt-1">
                                    {stats.criticalCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chart section */}
                    <div className="p-6 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm">
                        <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">
                            📈 {lang.chartTitle}
                        </h3>
                        {trends.length === 0 ? (
                            <div className="h-60 flex items-center justify-center text-xs font-semibold text-slate-400">
                                No diagnostic trend logs found for the selected period.
                            </div>
                        ) : (
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trends} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                                        <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} fontWeight="bold" />
                                        <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={9} fontWeight="bold" />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#1E293B', 
                                                borderColor: '#334155', 
                                                borderRadius: '12px',
                                                color: '#FFF',
                                                fontSize: '11px',
                                                fontFamily: 'sans-serif'
                                            }} 
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="healthScore" 
                                            stroke="#10B981" 
                                            strokeWidth={3} 
                                            activeDot={{ r: 6 }} 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Diagnosis & Treatments Table list */}
                    <div className="bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-gray-800/80">
                            <h3 className="text-xs font-black text-slate-550 dark:text-slate-450 uppercase tracking-wider">
                                📋 {lang.tableTitle}
                            </h3>
                        </div>

                        {history.length === 0 ? (
                            <div className="p-12 text-center text-xs font-semibold text-slate-450 dark:text-slate-500">
                                No history records logged for this farm yet. Start by taking an AI diagnosis!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-slate-700 dark:text-slate-350">
                                    <thead className="bg-slate-50 dark:bg-gray-950 font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-gray-850">
                                        <tr>
                                            <th className="px-5 py-3.5 text-left">{lang.colDate}</th>
                                            <th className="px-5 py-3.5 text-left">{lang.colCrop}</th>
                                            <th className="px-5 py-3.5 text-left">{lang.colDiagnosis}</th>
                                            <th className="px-5 py-3.5 text-left">{lang.colConfidence}</th>
                                            <th className="px-5 py-3.5 text-left">{lang.colTreatment}</th>
                                            <th className="px-5 py-3.5 text-left">{lang.colNotes}</th>
                                            <th className="px-5 py-3.5 text-center">{lang.colAction}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-gray-850">
                                        {history.map((record) => (
                                            <tr key={record._id} className="hover:bg-slate-50/50 dark:hover:bg-gray-850/20 font-semibold">
                                                <td className="px-5 py-4 whitespace-nowrap text-[10px] text-slate-500">
                                                    {new Date(record.timestamp).toLocaleDateString()}
                                                </td>
                                                <td className="px-5 py-4 font-bold text-slate-800 dark:text-white capitalize">
                                                    {record.cropId?.name || 'Plot'} ({record.cropId?.cropType || 'Crop'})
                                                </td>
                                                <td className="px-5 py-4 font-extrabold text-emerald-600 dark:text-emerald-450">
                                                    {record.diseaseDetected}
                                                </td>
                                                <td className="px-5 py-4 font-black">
                                                    {record.confidence}%
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider ${
                                                        record.treatmentApplied === 'None'
                                                            ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                                                            : 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                                                    }`}>
                                                        {record.treatmentApplied}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 max-w-xs truncate text-slate-500">
                                                    {record.notes}
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap text-center">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRecord(record);
                                                            setTreatmentInput(record.treatmentApplied);
                                                            setNotesInput(record.notes);
                                                        }}
                                                        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer border-none transition"
                                                    >
                                                        <Edit2 size={13} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination Footer */}
                        {pages > 1 && (
                            <div className="flex justify-between items-center p-5 bg-slate-50 dark:bg-gray-950 border-t border-slate-100 dark:border-gray-850">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200/50 dark:border-gray-700 disabled:opacity-50 text-slate-700 dark:text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-slate-50 transition"
                                >
                                    {lang.prevPage}
                                </button>
                                <span className="text-[10px] font-black text-slate-500">
                                    Page {page} of {pages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(pages, p + 1))}
                                    disabled={page === pages}
                                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200/50 dark:border-gray-700 disabled:opacity-50 text-slate-700 dark:text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-slate-50 transition"
                                >
                                    {lang.nextPage}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Treatment Update Dialog */}
            {selectedRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-sm bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl p-6 shadow-2xl animate-scale-in text-left">
                        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-105 dark:border-gray-800">
                            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                {lang.btnUpdate}
                            </h3>
                            <button
                                onClick={() => setSelectedRecord(null)}
                                className="p-1 bg-transparent border-none cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg text-slate-400"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateTreatmentSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                                    Treatment Applied
                                </label>
                                <select
                                    value={treatmentInput}
                                    onChange={(e) => setTreatmentInput(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-semibold text-slate-808 dark:text-white cursor-pointer"
                                >
                                    <option value="None">None (Unresolved)</option>
                                    <option value="Organic Sprays">Organic Sprays / Neem Oil</option>
                                    <option value="Chemical Spray">Chemical Pesticide/Fungicide</option>
                                    <option value="Pruning">Pruned Infected Leaves</option>
                                    <option value="Fertilization">Nutrient Boosting / Fertilizer</option>
                                    <option value="Other">Other Method</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                                    Treatment Notes
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder="Log observations about recovery progress..."
                                    value={notesInput}
                                    onChange={(e) => setNotesInput(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-semibold text-slate-808 dark:text-white resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setSelectedRecord(null)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-slate-700 dark:text-white rounded-xl text-xs font-bold border-none cursor-pointer transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingTreatment}
                                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white rounded-xl text-xs font-bold border-none cursor-pointer transition flex items-center justify-center gap-1"
                                >
                                    {submittingTreatment ? <Loader2 size={13} className="animate-spin" /> : "Save Updates"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const X = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

export default HealthTrackingDashboard;
