import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AppContext } from '../context/AppContext';
import { X, Loader2, ShieldAlert, Sliders, Layers } from 'lucide-react';

const IrrigationModal = ({ isOpen, onClose, plot }) => {
    const [loading, setLoading] = useState(false);
    const [adviceData, setAdviceData] = useState(null);
    const [volumes, setVolumes] = useState({ liters: '0', gallons: '0' });
    const [error, setError] = useState(null);
    const [isManualMode, setIsManualMode] = useState(false);

    // Form inputs for manual advisor
    const [manualInputs, setManualInputs] = useState({
        location: '',
        cropType: 'wheat',
        soilType: 'Loamy',
        area: '1'
    });

    const { language } = useContext(AppContext);

    // Translations mapping
    const t = {
        en: {
            title: "💧 Smart Irrigation",
            subtitleAcres: "Acres of",
            calculating: "Calculating crop water needs...",
            errorAdvice: "Failed to fetch live irrigation plan.",
            btnClose: "Close",
            tempLabel: "Local Temperature",
            humidityLabel: "Humidity",
            volLabel: "Volume Needed",
            galLabel: "In Gallons",
            freqLabel: "⏱ Frequency:",
            waterLevelLabel: "🚰 Water Level:",
            urgencyLabel: "⚠️ Urgency:",
            btnAck: "Acknowledge Schedule",
            pauseIrrigation: "Pause Irrigation",
            tabPlot: "Plot Schedule",
            tabManual: "Manual Advisor",
            lblLocation: "Farm Location (City/Village)",
            lblCrop: "Crop Type",
            lblSoil: "Soil Type",
            lblArea: "Acreage (Acres)",
            btnCalculate: "Calculate Recommendations",
            btnBack: "Back"
        },
        es: {
            title: "💧 Riego Inteligente",
            subtitleAcres: "Acres de",
            calculating: "Calculando necesidades de agua...",
            errorAdvice: "No se pudo obtener el plan de riego en vivo.",
            btnClose: "Cerrar",
            tempLabel: "Temperatura Local",
            humidityLabel: "Humedad",
            volLabel: "Volumen Necesario",
            galLabel: "En Galones",
            freqLabel: "⏱ Frecuencia:",
            waterLevelLabel: "🚰 Nivel de Agua:",
            urgencyLabel: "⚠️ Urgencia:",
            btnAck: "Aceptar Programación",
            pauseIrrigation: "Pausar Riego",
            tabPlot: "Programación de Parcela",
            tabManual: "Asesor Manual",
            lblLocation: "Ubicación del Campo (Ciudad/Pueblo)",
            lblCrop: "Tipo de Cultivo",
            lblSoil: "Tipo de Suelo",
            lblArea: "Superficie (Acres)",
            btnCalculate: "Calcular Recomendaciones",
            btnBack: "Atrás"
        },
        hi: {
            title: "💧 स्मार्ट सिंचाई",
            subtitleAcres: "एकड़ फसल:",
            calculating: "फसल पानी की जरूरतों की गणना की जा रही है...",
            errorAdvice: "लाइव सिंचाई योजना प्राप्त करने में विफल।",
            btnClose: "बंद करें",
            tempLabel: "स्थानीय तापमान",
            humidityLabel: "आर्द्रता",
            volLabel: "आवश्यक मात्रा",
            galLabel: "गैलन में",
            freqLabel: "⏱ आवृत्ति (Frequency):",
            waterLevelLabel: "🚰 जल स्तर (Level):",
            urgencyLabel: "⚠️ तात्कालिकता:",
            btnAck: "शेड्यूल स्वीकार करें",
            pauseIrrigation: "सिंचाई रोकें",
            tabPlot: "प्लॉट शेड्यूल",
            tabManual: "मैनुअल सलाहकार",
            lblLocation: "खेत का स्थान (शहर/गाँव)",
            lblCrop: "फसल का प्रकार",
            lblSoil: "मिट्टी का प्रकार",
            lblArea: "क्षेत्रफल (एकड़)",
            btnCalculate: "सिफारिशों की गणना करें",
            btnBack: "पीछे"
        }
    };
    const lang = t[language] || t.en;

    // Reset state on open/plot change
    useEffect(() => {
        if (isOpen) {
            setAdviceData(null);
            setError(null);
            if (plot && !plot.isManual) {
                setIsManualMode(false);
                fetchPlotAdvice();
            } else {
                setIsManualMode(true);
            }
        }
    }, [isOpen, plot]);

    const fetchPlotAdvice = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/irrigation/${plot._id}`);
            const data = response.data;
            setAdviceData(data);
            
            // Calculate scaled volumetric needs based on crop, area, and backend weatherVolume
            const waterVol = data.recommendation.waterVolume;
            const calculated = calculateWaterNeeds(plot.cropType, plot.area, waterVol);
            setVolumes(calculated);
        } catch (err) {
            console.error("Error fetching irrigation advice:", err);
            setError(lang.errorAdvice);
        } finally {
            setLoading(false);
        }
    };

    const handleCalculateManual = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/irrigation/recommend', {
                location: manualInputs.location || 'Meerut',
                cropType: manualInputs.cropType,
                soilType: manualInputs.soilType,
                area: Number(manualInputs.area || 1)
            });
            const data = response.data;
            setAdviceData(data);
            
            // Calculate scaled volumetric needs
            const waterVol = data.recommendation.waterVolume;
            const calculated = calculateWaterNeeds(manualInputs.cropType, Number(manualInputs.area || 1), waterVol);
            setVolumes(calculated);
        } catch (err) {
            console.error("Error calculating manual irrigation advice:", err);
            setError(lang.errorAdvice);
        } finally {
            setLoading(false);
        }
    };

    const calculateWaterNeeds = (crop, area, weatherVolume) => {
        const normalizedCrop = crop.toLowerCase().trim();
        const cropData = {
            sugarcane: { base: 25000 },
            rice: { base: 30000 },
            wheat: { base: 15000 },
            corn: { base: 18000 },
            cotton: { base: 20000 },
            default: { base: 15000 }
        };

        const cropStats = cropData[normalizedCrop] || cropData.default;
        
        let multiplier = 1.0;
        if (weatherVolume === 'None') multiplier = 0;
        else if (weatherVolume === 'Low' || weatherVolume === 'Low to Moderate') multiplier = 0.7;
        else if (weatherVolume === 'High') multiplier = 1.3;

        const totalLiters = Math.round(cropStats.base * area * multiplier);
        const totalGallons = Math.round(totalLiters * 0.264172);

        return {
            liters: totalLiters.toLocaleString(),
            gallons: totalGallons.toLocaleString()
        };
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-2xl relative animate-scale-in text-left">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center relative">
                    <button 
                        onClick={onClose} 
                        className="absolute p-1.5 text-blue-200 top-4 right-4 hover:text-white hover:bg-white/10 rounded-xl transition border-none cursor-pointer bg-transparent"
                    >
                        <X size={16} />
                    </button>
                    <h2 className="text-xl font-black flex justify-center items-center gap-1.5 text-white">
                        {lang.title}
                    </h2>
                    {plot && !plot.isManual ? (
                        <p className="opacity-95 mt-1 text-xs font-semibold">
                            {plot.name} ({plot.area} {lang.subtitleAcres} {plot.cropType})
                        </p>
                    ) : (
                        <p className="opacity-95 mt-1 text-xs font-semibold">
                            {lang.tabManual}
                        </p>
                    )}
                </div>

                {/* Switcher Tab (only visible if a valid plot was passed) */}
                {plot && !plot.isManual && (
                    <div className="flex border-b border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-950 p-1">
                        <button
                            onClick={() => {
                                setIsManualMode(false);
                                setAdviceData(null);
                                fetchPlotAdvice();
                            }}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 ${
                                !isManualMode 
                                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            <Layers size={13} />
                            {lang.tabPlot}
                        </button>
                        <button
                            onClick={() => {
                                setIsManualMode(true);
                                setAdviceData(null);
                                setError(null);
                            }}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 ${
                                isManualMode 
                                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            <Sliders size={13} />
                            {lang.tabManual}
                        </button>
                    </div>
                )}

                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-16 gap-3 text-slate-450 dark:text-slate-500">
                            <Loader2 size={32} className="animate-spin text-blue-500" />
                            <p className="text-xs font-bold animate-pulse">{lang.calculating}</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 flex flex-col items-center gap-4">
                            <ShieldAlert size={36} className="text-red-500" />
                            <p className="text-xs font-bold text-red-500">{error}</p>
                            <button 
                                onClick={() => {
                                    setError(null);
                                    if (!isManualMode) fetchPlotAdvice();
                                }}
                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-slate-750 dark:text-slate-250 font-bold rounded-xl text-xs border-none cursor-pointer transition"
                            >
                                Retry
                            </button>
                        </div>
                    ) : !adviceData && isManualMode ? (
                        /* Manual advisor input form */
                        <form onSubmit={handleCalculateManual} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    {lang.lblLocation}
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Meerut, Hapur"
                                    value={manualInputs.location}
                                    onChange={(e) => setManualInputs({ ...manualInputs, location: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm font-medium text-slate-800 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        {lang.lblCrop}
                                    </label>
                                    <select
                                        value={manualInputs.cropType}
                                        onChange={(e) => setManualInputs({ ...manualInputs, cropType: e.target.value })}
                                        className="w-full px-3 py-3 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium text-slate-805 dark:text-white cursor-pointer"
                                    >
                                        <option value="wheat">Wheat</option>
                                        <option value="sugarcane">Sugarcane</option>
                                        <option value="rice">Rice</option>
                                        <option value="corn">Corn</option>
                                        <option value="cotton">Cotton</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        {lang.lblSoil}
                                    </label>
                                    <select
                                        value={manualInputs.soilType}
                                        onChange={(e) => setManualInputs({ ...manualInputs, soilType: e.target.value })}
                                        className="w-full px-3 py-3 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium text-slate-805 dark:text-white cursor-pointer"
                                    >
                                        <option value="Loamy">Loamy</option>
                                        <option value="Clay">Clay</option>
                                        <option value="Sandy">Sandy</option>
                                        <option value="Silt">Silt</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    {lang.lblArea}
                                </label>
                                <input
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={manualInputs.area}
                                    onChange={(e) => setManualInputs({ ...manualInputs, area: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm font-medium text-slate-800 dark:text-white"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 mt-4 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md border-none cursor-pointer text-sm"
                            >
                                {lang.btnCalculate}
                            </button>
                        </form>
                    ) : (
                        /* Results display panel */
                        <div className="space-y-5 animate-fade-in">
                            
                            {/* Weather Card */}
                            {adviceData.currentWeather && (
                                <div className="flex items-center justify-between p-3.5 bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-950 rounded-xl text-xs">
                                    <div>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{lang.tempLabel}</p>
                                        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 capitalize mt-0.5">
                                            {adviceData.currentWeather.temp}°C, {adviceData.currentWeather.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{lang.humidityLabel}</p>
                                        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{adviceData.currentWeather.humidity}%</p>
                                    </div>
                                </div>
                            )}

                            {/* Recommendation Summary */}
                            <div className="p-5 rounded-2xl border text-center bg-slate-50 dark:bg-gray-950 border-slate-200/50 dark:border-gray-800/50">
                                <span className={`inline-block px-3 py-0.5 text-[9px] font-black rounded-full mb-2.5 uppercase tracking-wider ${
                                    adviceData.recommendation.action === 'Pause Irrigation' 
                                        ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400 border border-yellow-250/20' 
                                        : 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-250/20'
                                }`}>
                                    {adviceData.recommendation.action === 'Pause Irrigation' ? lang.pauseIrrigation : adviceData.recommendation.action}
                                </span>
                                <h3 className="text-sm font-extrabold text-slate-850 dark:text-slate-100 px-2 leading-relaxed">
                                    {adviceData.recommendation.reason}
                                </h3>
                            </div>

                            {/* Water Volume Cards */}
                            {adviceData.recommendation.action !== 'Pause Irrigation' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-950 p-4 rounded-xl text-center">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{lang.volLabel}</p>
                                        <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">{volumes.liters} L</p>
                                    </div>
                                    <div className="bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-950 p-4 rounded-xl text-center">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{lang.galLabel}</p>
                                        <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">{volumes.gallons} G</p>
                                    </div>
                                </div>
                            )}

                            {/* Schedule Details */}
                            <div className="space-y-2 pt-2 border-t border-slate-150 dark:border-gray-800">
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-gray-955/50 p-3 rounded-xl text-xs font-semibold">
                                    <span className="text-slate-500 dark:text-slate-400">{lang.freqLabel}</span>
                                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{adviceData.recommendation.frequency}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-gray-955/50 p-3 rounded-xl text-xs font-semibold">
                                    <span className="text-slate-500 dark:text-slate-400">{lang.waterLevelLabel}</span>
                                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{adviceData.recommendation.waterVolume}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-gray-955/50 p-3 rounded-xl text-xs font-semibold">
                                    <span className="text-slate-500 dark:text-slate-400">{lang.urgencyLabel}</span>
                                    <span className={`font-extrabold uppercase tracking-wide text-[10px] px-2 py-0.5 rounded ${
                                        adviceData.recommendation.urgency === 'High' 
                                            ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200/20' 
                                            : 'text-slate-800 dark:text-slate-200'
                                    }`}>{adviceData.recommendation.urgency}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {isManualMode && (
                                    <button 
                                        onClick={() => {
                                            setAdviceData(null);
                                            setError(null);
                                        }}
                                        className="flex-1 py-3 font-bold text-slate-650 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white rounded-xl transition border-none cursor-pointer text-xs"
                                    >
                                        {lang.btnBack}
                                    </button>
                                )}
                                <button 
                                    onClick={onClose}
                                    className="flex-1 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md border-none cursor-pointer text-xs active:scale-95"
                                >
                                    {lang.btnAck}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IrrigationModal;