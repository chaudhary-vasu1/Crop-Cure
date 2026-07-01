import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { ShieldCheck, BarChart2, AlertCircle, ArrowUpCircle, Loader2 } from 'lucide-react';

const UsagePage = () => {
    const { language } = useContext(AppContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [usage, setUsage] = useState(null);

    const t = {
        en: {
            title: "📊 Plan Usage & Limits",
            subtitle: "Monitor diagnostic scan metrics and farm allowances matching your tier",
            tierLabel: "Active Tier:",
            diagnoses: "Diagnoses Used Today",
            farms: "Farms Registered",
            upgradeRecommend: "Need more capacity?",
            upgradeBtn: "Upgrade Plan",
            unlimited: "Unlimited",
            alertLimitReached: "You have reached the maximum daily limit for your plan tier. Please upgrade to remove restrictions."
        },
        es: {
            title: "📊 Uso del Plan y Límites",
            subtitle: "Monitoree las métricas de diagnóstico y límites de campos",
            tierLabel: "Plan Activo:",
            diagnoses: "Diagnósticos Utilizados Hoy",
            farms: "Campos Registrados",
            upgradeRecommend: "¿Necesita más capacidad?",
            upgradeBtn: "Actualizar Plan",
            unlimited: "Ilimitado",
            alertLimitReached: "Ha alcanzado el límite diario máximo para su nivel de plan. Actualice para eliminar restricciones."
        },
        hi: {
            title: "📊 योजना उपयोग और सीमाएं",
            subtitle: "अपनी योजना के अनुसार निदान स्कैन और खेतों की संख्या की सीमाएं देखें",
            tierLabel: "सक्रिय योजना:",
            diagnoses: "आज उपयोग किए गए निदान",
            farms: "पंजीकृत खेत",
            upgradeRecommend: "और अधिक सीमा चाहिए?",
            upgradeBtn: "योजना अपग्रेड करें",
            unlimited: "असीमित (Unlimited)",
            alertLimitReached: "आप अपनी योजना स्तर के लिए दैनिक सीमा पर पहुंच गए हैं। प्रतिबंध हटाने के लिए अपग्रेड करें।"
        }
    };
    const lang = t[language] || t.en;

    const fetchUsage = async () => {
        setLoading(true);
        try {
            const response = await api.get('/subscription/usage');
            setUsage(response.data);
        } catch (error) {
            console.error("Failed to load usage statistics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsage();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-32 gap-3 text-slate-400">
                <Loader2 size={32} className="animate-spin text-emerald-500" />
                <p className="text-xs font-bold font-mono">Quantifying usage logs...</p>
            </div>
        );
    }

    if (!usage) return null;

    const diagnosesPercentage = Math.min(100, Math.round((usage.diagnosesUsedToday / usage.diagnosesLimit) * 100));
    const farmsPercentage = Math.min(100, Math.round((usage.farmsCount / usage.farmsLimit) * 100));

    const isDiagnosesLimitReached = usage.diagnosesUsedToday >= usage.diagnosesLimit;
    const isFarmsLimitReached = usage.farmsCount >= usage.farmsLimit;

    return (
        <div className="container mx-auto px-4 py-8 text-left max-w-2xl">
            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {lang.title}
            </h2>
            <p className="text-xs text-slate-450 dark:text-slate-550 font-semibold mt-1 mb-8">
                {lang.subtitle}
            </p>

            <div className="space-y-6">
                {/* Active Tier Display */}
                <div className="p-5 bg-white dark:bg-gray-900 border border-slate-200/40 dark:border-gray-800/60 rounded-3xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-450">{lang.tierLabel}</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-250/20 text-xs font-black rounded-full uppercase tracking-wider">
                        {usage.tier}
                    </span>
                </div>

                {/* Diagnostics Progress Meter */}
                <div className="p-5 bg-white dark:bg-gray-900 border border-slate-200/40 dark:border-gray-800/60 rounded-3xl space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-700 dark:text-slate-350">{lang.diagnoses}</span>
                        <span className="text-slate-800 dark:text-white">
                            {usage.diagnosesUsedToday} / {usage.diagnosesLimit > 999 ? lang.unlimited : usage.diagnosesLimit}
                        </span>
                    </div>
                    {usage.diagnosesLimit <= 999 && (
                        <div className="w-full h-2.5 bg-slate-100 dark:bg-gray-850 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-emerald-500 transition-all duration-500" 
                                style={{ width: `${diagnosesPercentage}%` }}
                            ></div>
                        </div>
                    )}
                </div>

                {/* Farms Limit Progress Meter */}
                <div className="p-5 bg-white dark:bg-gray-900 border border-slate-200/40 dark:border-gray-800/60 rounded-3xl space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-700 dark:text-slate-350">{lang.farms}</span>
                        <span className="text-slate-800 dark:text-white">
                            {usage.farmsCount} / {usage.farmsLimit}
                        </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-gray-850 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-emerald-500 transition-all duration-500" 
                            style={{ width: `${farmsPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Alerts warnings if limits are reached */}
                {(isDiagnosesLimitReached || isFarmsLimitReached) && (
                    <div className="p-4 bg-yellow-50 text-yellow-750 dark:bg-yellow-950/20 dark:text-yellow-450 border border-yellow-250/20 rounded-2xl flex items-start gap-2.5 text-xs font-semibold leading-relaxed">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <p>{lang.alertLimitReached}</p>
                    </div>
                )}

                {/* Upgrade Callout */}
                {usage.tier !== 'professional' && (
                    <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="text-left">
                            <p className="text-sm font-extrabold text-white flex items-center gap-1">
                                <ArrowUpCircle size={16} className="text-emerald-450" />
                                {lang.upgradeRecommend}
                            </p>
                            <p className="text-[10px] text-slate-350 font-semibold mt-1">
                                Upgrade plans to lift diagnoses boundaries and add up to 5 farms!
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/pricing')}
                            className="w-full sm:w-auto py-2.5 px-5 bg-emerald-500 hover:bg-emerald-600 text-white border-none font-black text-xs rounded-xl cursor-pointer shadow-md transition"
                        >
                            {lang.upgradeBtn}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsagePage;
