import { useState, useContext } from 'react';
import api from '../utils/api';
import { AppContext } from '../context/AppContext';
import { X, ShieldAlert, Leaf, FlaskConical, Loader2, Upload } from 'lucide-react';

const DiagnoseModal = ({ isOpen, onClose, plot }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [diagnosis, setDiagnosis] = useState(null);
    const [error, setError] = useState(null);

    const { language } = useContext(AppContext);

    // Translations mapping
    const t = {
        en: {
            diagnoseTitle: "Diagnose:",
            uploadPhoto: "Upload leaf photo",
            selectClear: "Select a clear, well-lit leaf closeup image",
            analyzing: "🧠 AI is analyzing...",
            runDiag: "Run AI Diagnostics",
            resultsTitle: "Diagnosis Complete",
            healthyLeaf: "Healthy Crop Leaf 🎉",
            alertFlagged: "Alert Flagged",
            confidenceRating: "AI confidence rating",
            contagious: "Contagious",
            organicTitle: "Organic Treatment",
            chemicalTitle: "Chemical Treatment",
            noTreatText: "No treatments necessary. Maintain standard organic watering and crop monitoring routines to sustain leaf health.",
            btnDone: "Done",
            errorNoPhoto: "Please select an image first."
        },
        es: {
            diagnoseTitle: "Diagnosticar:",
            uploadPhoto: "Subir foto de la hoja",
            selectClear: "Seleccione una imagen clara y bien iluminada del primer plano de la hoja",
            analyzing: "🧠 La IA está analizando...",
            runDiag: "Ejecutar Diagnóstico de IA",
            resultsTitle: "Diagnóstico Completado",
            healthyLeaf: "Hoja de Cultivo Sana 🎉",
            alertFlagged: "Alerta Marcada",
            confidenceRating: "Calificación de confianza de la IA",
            contagious: "Contagioso",
            organicTitle: "Tratamiento Orgánico",
            chemicalTitle: "Tratamiento Químico",
            noTreatText: "No se necesitan tratamientos. Mantenga las rutinas habituales de riego orgánico y monitoreo de cultivos para conservar la salud de las hojas.",
            btnDone: "Completado",
            errorNoPhoto: "Seleccione una imagen primero."
        },
        hi: {
            diagnoseTitle: "निदान:",
            uploadPhoto: "पत्ती की फोटो अपलोड करें",
            selectClear: "पत्ती की एक स्पष्ट, अच्छी रोशनी वाली क्लोज़अप छवि चुनें",
            analyzing: "🧠 एआई विश्लेषण कर रहा है...",
            runDiag: "एआई निदान चलाएं",
            resultsTitle: "निदान पूर्ण",
            healthyLeaf: "स्वस्थ फसल पत्ती 🎉",
            alertFlagged: "अलर्ट जारी किया गया",
            confidenceRating: "एआई आत्मविश्वास रेटिंग",
            contagious: "संक्रामक",
            organicTitle: "जैविक उपचार",
            chemicalTitle: "रासायनिक उपचार",
            noTreatText: "किसी उपचार की आवश्यकता नहीं है। पत्ती के स्वास्थ्य को बनाए रखने के लिए मानक जैविक पानी देने और फसल निगरानी दिनचर्या को बनाए रखें।",
            btnDone: "पूर्ण",
            errorNoPhoto: "कृपया पहले एक छवि चुनें।"
        }
    };
    const lang = t[language] || t.en;

    if (!isOpen || !plot) return null;

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setDiagnosis(null); 
            setError(null);
        }
    };

    const handleDiagnose = async () => {
        if (!file) {
            setError(lang.errorNoPhoto);
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file); 

        try {
            const response = await api.post(`/diagnostics/${plot._id}?lang=${language}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDiagnosis(response.data); 
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to analyze the image.");
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setFile(null);
        setPreview(null);
        setDiagnosis(null);
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-2xl p-8 relative animate-scale-in text-left">
                
                {/* Close Button */}
                <button 
                    onClick={resetAndClose} 
                    className="absolute p-1.5 text-slate-400 top-5 right-5 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-855 rounded-xl transition border-none cursor-pointer bg-transparent"
                >
                    <X size={16} />
                </button>

                <h2 className="mb-6 text-xl font-black text-slate-800 dark:text-white tracking-tight">
                    {lang.diagnoseTitle} {plot.name} <span className="text-emerald-500 font-extrabold">({plot.cropType})</span>
                </h2>

                {/* Upload Section (Hides if AI has returned a diagnosis) */}
                {!diagnosis ? (
                    <div className="space-y-5">
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-emerald-200/60 dark:border-emerald-950 border-dashed rounded-2xl bg-emerald-50/20 dark:bg-emerald-950/5 relative overflow-hidden group">
                            {preview ? (
                                <img src={preview} alt="Crop preview" className="object-cover max-h-60 rounded-xl mb-4 shadow-sm border border-slate-200 dark:border-gray-800" />
                            ) : (
                                <div className="flex flex-col items-center py-6 text-slate-450 dark:text-slate-500 text-center">
                                    <Upload size={32} className="mb-2 text-emerald-500" />
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-450 mt-1">{lang.uploadPhoto}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-1 font-semibold">{lang.selectClear}</p>
                                </div>
                            )}
                            
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 cursor-pointer mt-4"
                            />
                        </div>

                        {error && (
                            <p className="text-xs font-bold text-center text-red-500 bg-red-50/50 dark:bg-red-950/10 p-3 rounded-xl border border-red-200/20">
                                {error}
                            </p>
                        )}

                        <button 
                            onClick={handleDiagnose}
                            disabled={loading || !file}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-extrabold rounded-xl text-xs border-none cursor-pointer transition shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>{lang.analyzing}</span>
                                </>
                            ) : (
                                lang.runDiag
                            )}
                        </button>
                    </div>
                ) : (
                    /* The Results Panel (Shows when AI is done!) */
                    <div className="space-y-5 animate-fade-in text-left">
                        {/* Dynamic contextual top diagnosis header */}
                        {diagnosis.diseaseName.toLowerCase() === 'healthy' ? (
                            <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-2xl shadow-sm text-left">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">{lang.resultsTitle}</span>
                                <h3 className="text-2xl font-black mt-3 flex items-center gap-2">
                                    {lang.healthyLeaf}
                                </h3>
                                <p className="text-xs opacity-90 mt-1 font-semibold">{lang.confidenceRating}: {(diagnosis.confidenceScore * 100).toFixed(0)}%</p>
                            </div>
                        ) : (
                            <div className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl shadow-sm text-left">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">{lang.alertFlagged}</span>
                                <h3 className="text-2xl font-black mt-3 flex items-center gap-2">
                                    {diagnosis.diseaseName} ⚠️
                                </h3>
                                <p className="text-xs opacity-95 mt-1 font-semibold">{lang.confidenceRating}: {(diagnosis.confidenceScore * 100).toFixed(0)}%</p>
                                {diagnosis.isContagious && (
                                    <span className="inline-flex items-center gap-1 mt-3 px-2.5 py-0.5 text-[9px] font-black text-red-650 bg-white rounded-full uppercase tracking-wider animate-pulse shadow-sm">
                                        <ShieldAlert size={10} /> {lang.contagious}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="space-y-4">
                            {diagnosis.diseaseName.toLowerCase() !== 'healthy' && diagnosis.treatmentPlan ? (
                                <>
                                    <div className="p-5 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-950/50 rounded-2xl text-left">
                                        <h4 className="font-extrabold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                            <Leaf size={14} className="text-emerald-500" /> {lang.organicTitle}
                                        </h4>
                                        <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">
                                            {diagnosis.treatmentPlan.organic}
                                        </p>
                                    </div>
                                    <div className="p-5 bg-purple-50/20 dark:bg-purple-950/10 border border-purple-100/50 dark:border-purple-950/50 rounded-2xl text-left">
                                        <h4 className="font-extrabold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                            <FlaskConical size={14} className="text-purple-500" /> {lang.chemicalTitle}
                                        </h4>
                                        <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">
                                            {diagnosis.treatmentPlan.chemical}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="p-6 bg-slate-50 dark:bg-gray-950 border border-slate-200/50 dark:border-gray-800/50 rounded-2xl text-center">
                                    <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold leading-relaxed">
                                        {lang.noTreatText}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={resetAndClose}
                            className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-slate-750 dark:text-slate-300 font-bold rounded-xl text-xs border-none cursor-pointer transition active:scale-95 mt-4"
                        >
                            {lang.btnDone}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiagnoseModal;