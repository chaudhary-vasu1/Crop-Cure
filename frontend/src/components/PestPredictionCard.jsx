import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { ShieldAlert, Bug, Thermometer, Droplets, Calendar, Bell, CheckCircle, Loader2 } from 'lucide-react';

const PestPredictionCard = () => {
    const { selectedFarm, language } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [forecastData, setForecastData] = useState(null);
    const [preferences, setPreferences] = useState(null);
    const [showPrefsModal, setShowPrefsModal] = useState(false);
    const [updatingPrefs, setUpdatingPrefs] = useState(false);
    const [calAdded, setCalAdded] = useState({});

    const t = {
        en: {
            title: "🐛 Seasonal Pest & Disease Alert",
            subtitle: "ML-based predictions from weather, area logs, and crops",
            riskLabel: "Risk Level:",
            pestsTitle: "Likely Pests",
            diseasesTitle: "Likely Diseases",
            measuresTitle: "Preventive Measures",
            btnCalendar: "Schedule Spray",
            btnPrefs: "Alert Preferences",
            preferencesTitle: "Notification Settings",
            subscribed: "Opt-in to alerts",
            freqLabel: "Frequency",
            btnSave: "Save",
            saved: "Scheduled successfully!",
            low: "Low Risk",
            medium: "Medium Risk",
            high: "High Risk"
        },
        es: {
            title: "🐛 Alerta de Plagas y Enfermedades",
            subtitle: "Predicciones de IA basadas en clima, zona y cultivos",
            riskLabel: "Nivel de Riesgo:",
            pestsTitle: "Plagas Probables",
            diseasesTitle: "Enfermedades Probables",
            measuresTitle: "Medidas Preventivas",
            btnCalendar: "Programar Fumigación",
            btnPrefs: "Ajustes de Alerta",
            preferencesTitle: "Configuración de Notificación",
            subscribed: "Recibir alertas",
            freqLabel: "Frecuencia",
            btnSave: "Guardar",
            saved: "¡Programado!",
            low: "Riesgo Bajo",
            medium: "Riesgo Medio",
            high: "Riesgo Alto"
        },
        hi: {
            title: "🐛 मौसमी कीट और रोग चेतावनी",
            subtitle: "मौसम, क्षेत्र और फसलों के आधार पर एआई पूर्वानुमान",
            riskLabel: "जोखिम स्तर:",
            pestsTitle: "संभावित कीट",
            diseasesTitle: "संभावित रोग",
            measuresTitle: "निवारक उपाय",
            btnCalendar: "छिड़काव अनुसूची",
            btnPrefs: "चेतावनी प्राथमिकताएं",
            preferencesTitle: "अधिसूचना सेटिंग्स",
            subscribed: "अलर्ट प्राप्त करें",
            freqLabel: "आवृत्ति (Frequency)",
            btnSave: "सहेजें",
            saved: "शेड्यूल जोड़ दिया गया!",
            low: "कम जोखिम",
            medium: "मध्यम जोखिम",
            high: "उच्च जोखिम"
        }
    };
    const lang = t[language] || t.en;

    const fetchForecast = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/pest-forecast/${selectedFarm}`);
            setForecastData(response.data);
            
            // Get user subscription settings from api
            const userRes = await api.get('/user/subscription'); // gives usage, but let's check profile/auth info
            const profileRes = await api.get('/auth/profile').catch(() => null);
            if (profileRes && profileRes.data && profileRes.data.pestAlertPreferences) {
                setPreferences(profileRes.data.pestAlertPreferences);
            } else {
                setPreferences({ subscribed: false, frequency: 'weekly', email: true, sms: false, push: true });
            }
        } catch (error) {
            console.error("Error loading pest predictions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForecast();
    }, [selectedFarm]);

    const handleSavePreferences = async (e) => {
        e.preventDefault();
        setUpdatingPrefs(true);
        try {
            const response = await api.post(`/pest-forecast/${selectedFarm}/subscribe`, preferences);
            alert("Preferences saved successfully!");
            setShowPrefsModal(false);
        } catch (err) {
            console.error("Failed to update notification settings:", err);
        } finally {
            setUpdatingPrefs(false);
        }
    };

    const handleAddToCalendar = (idx, spray) => {
        setCalAdded({ ...calAdded, [`${idx}-${spray}`]: true });
        setTimeout(() => {
            alert(`Added event: "Schedule: Apply ${spray} for crop protection" to calendar for next Saturday.`);
        }, 150);
    };

    if (loading) {
        return (
            <div className="p-8 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl flex flex-col justify-center items-center gap-3">
                <Loader2 className="animate-spin text-emerald-500" size={28} />
                <p className="text-xs font-bold text-slate-400">Loading pest alerts...</p>
            </div>
        );
    }

    if (!forecastData) return null;

    const riskColors = {
        low: 'bg-green-50 text-green-750 border-green-200/30 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30',
        medium: 'bg-yellow-50 text-yellow-750 border-yellow-200/30 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30',
        high: 'bg-red-50 text-red-755 border-red-200/30 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
    };

    const riskBadge = riskColors[forecastData.riskLevel] || riskColors.low;
    const resolvedRiskText = lang[forecastData.riskLevel] || forecastData.riskLevel;

    return (
        <div className="p-6 sm:p-8 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm text-left relative overflow-hidden">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {lang.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                        {lang.subtitle}
                    </p>
                </div>
                <button
                    onClick={() => setShowPrefsModal(true)}
                    className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-gray-950 dark:hover:bg-gray-800 border border-slate-200/40 dark:border-gray-800 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer flex items-center gap-1.5 transition"
                >
                    <Bell size={13} className="text-emerald-500" />
                    <span>{lang.btnPrefs}</span>
                </button>
            </div>

            {/* Quick weather variables displaying rule insights */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-gray-950 rounded-2xl border border-slate-200/10 dark:border-gray-850 mb-6 text-xs font-bold text-slate-650 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                    <Thermometer size={14} className="text-orange-500" />
                    <span>{forecastData.weatherMetrics.temp}°C</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Droplets size={14} className="text-blue-500" />
                    <span>{forecastData.weatherMetrics.humidity}% Humidity</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-emerald-500" />
                    <span className="capitalize">{forecastData.weatherMetrics.condition}</span>
                </div>
            </div>

            {/* General Risk assessment banner */}
            <div className={`p-4 border rounded-2xl mb-6 flex items-start gap-3 ${riskBadge}`}>
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-extrabold flex items-center gap-1.5">
                        <span>{lang.riskLabel}</span>
                        <span className="uppercase tracking-wider font-black">{resolvedRiskText}</span>
                    </p>
                    <p className="text-[11px] font-semibold opacity-90 mt-1 leading-relaxed">
                        {forecastData.explanation}
                    </p>
                </div>
            </div>

            {/* Crop Specific Lists */}
            <div className="space-y-6">
                {forecastData.forecasts.map((fc, idx) => (
                    <div key={idx} className="p-5 border border-slate-100 dark:border-gray-800/80 rounded-2xl space-y-4">
                        <div className="flex items-center gap-1.5 border-b border-slate-50 dark:border-gray-850 pb-2">
                            <span className="text-lg">🌾</span>
                            <span className="text-xs font-black text-slate-805 dark:text-slate-100 capitalize">{fc.cropType} Forecast</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Pests list */}
                            <div className="bg-slate-50/50 dark:bg-gray-950/20 p-3.5 rounded-xl border border-slate-100 dark:border-gray-850">
                                <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2.5">
                                    <Bug size={13} className="text-red-500" />
                                    {lang.pestsTitle}
                                </h4>
                                <ul className="space-y-1.5 text-xs text-slate-550 dark:text-slate-400 font-semibold list-none pl-0">
                                    {fc.likelyPests.map((pest, pIdx) => (
                                        <li key={pIdx} className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0"></span>
                                            <span>{pest}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Diseases list */}
                            <div className="bg-slate-50/50 dark:bg-gray-950/20 p-3.5 rounded-xl border border-slate-100 dark:border-gray-850">
                                <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2.5">
                                    <ShieldAlert size={13} className="text-orange-500" />
                                    {lang.diseasesTitle}
                                </h4>
                                <ul className="space-y-1.5 text-xs text-slate-550 dark:text-slate-400 font-semibold list-none pl-0">
                                    {fc.likelyDiseases.map((disease, dIdx) => (
                                        <li key={dIdx} className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full shrink-0"></span>
                                            <span>{disease}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Preventive Measures */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                                🛡️ {lang.measuresTitle}
                            </h4>
                            <ul className="space-y-2 list-none pl-0 text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                {fc.preventiveMeasures.map((measure, mIdx) => (
                                    <li key={mIdx} className="flex items-start gap-2">
                                        <span className="text-emerald-500 select-none mt-0.5">✓</span>
                                        <span>{measure}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recommended spray schedule action */}
                        {fc.spraySchedule.map((spray, sIdx) => (
                            <div key={sIdx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-blue-50/10 dark:bg-blue-950/5 border border-blue-100/30 dark:border-blue-900/30 rounded-xl gap-3">
                                <div className="text-xs font-semibold text-slate-650 dark:text-slate-400">
                                    <span className="font-extrabold text-blue-600 dark:text-blue-450 mr-1.5">📅 Recommended:</span>
                                    <span>{spray}</span>
                                </div>
                                <button
                                    onClick={() => handleAddToCalendar(idx, spray)}
                                    disabled={calAdded[`${idx}-${spray}`]}
                                    className={`px-3.5 py-1.5 rounded-lg font-bold text-[10px] border-none cursor-pointer flex items-center gap-1 transition ${
                                        calAdded[`${idx}-${spray}`]
                                            ? 'bg-green-500 text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                    }`}
                                >
                                    {calAdded[`${idx}-${spray}`] ? (
                                        <>
                                            <CheckCircle size={11} />
                                            <span>{lang.saved}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Calendar size={11} />
                                            <span>{lang.btnCalendar}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Notification preferences sub-modal */}
            {showPrefsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fade-in text-left">
                    <div className="w-full max-w-sm bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl p-6 shadow-2xl animate-scale-in">
                        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-gray-800">
                            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Bell size={16} className="text-emerald-500" />
                                {lang.preferencesTitle}
                            </h3>
                            <button
                                onClick={() => setShowPrefsModal(false)}
                                className="p-1 bg-transparent border-none cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg text-slate-400"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSavePreferences} className="space-y-4">
                            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-gray-950 rounded-xl">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{lang.subscribed}</span>
                                <input
                                    type="checkbox"
                                    checked={preferences?.subscribed}
                                    onChange={(e) => setPreferences({ ...preferences, subscribed: e.target.checked })}
                                    className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                                    {lang.freqLabel}
                                </label>
                                <select
                                    value={preferences?.frequency}
                                    onChange={(e) => setPreferences({ ...preferences, frequency: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
                                >
                                    <option value="daily">Daily Alerts</option>
                                    <option value="weekly">Weekly Alerts</option>
                                </select>
                            </div>

                            <div className="space-y-2 bg-slate-50/50 dark:bg-gray-950/20 p-3.5 rounded-xl border border-slate-100 dark:border-gray-850">
                                <p className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500 tracking-wider mb-2.5">
                                    Communication Channels
                                </p>
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-650 dark:text-slate-450">
                                    <span>Email Messages</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences?.email}
                                        onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
                                        className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 cursor-pointer"
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-650 dark:text-slate-455">
                                    <span>SMS Text Messages</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences?.sms}
                                        onChange={(e) => setPreferences({ ...preferences, sms: e.target.checked })}
                                        className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 cursor-pointer"
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-650 dark:text-slate-455">
                                    <span>In-App Center Notifications</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences?.inApp}
                                        onChange={(e) => setPreferences({ ...preferences, inApp: e.target.checked })}
                                        className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setShowPrefsModal(false)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-white rounded-xl text-xs font-bold border-none cursor-pointer transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updatingPrefs}
                                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white rounded-xl text-xs font-bold border-none cursor-pointer transition flex items-center justify-center gap-1"
                                >
                                    {updatingPrefs ? <Loader2 size={13} className="animate-spin" /> : lang.btnSave}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PestPredictionCard;
