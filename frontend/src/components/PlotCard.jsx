import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Trash2, MapPin, Layers, Droplet, Check, X, ShieldAlert } from 'lucide-react';

const PlotCard = ({ plot, onDelete, onDiagnose, onIrrigation }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const { language } = useContext(AppContext);

    // Translations mapping
    const t = {
        en: {
            deleteTitle: "Delete Plot?",
            deleteDesc: "Are you sure you want to remove",
            deleteSub: "This action cannot be undone.",
            btnCancel: "Cancel",
            btnDelete: "Delete",
            unnamed: "Unnamed Plot",
            cropUnspecified: "Crop not specified",
            labelArea: "Plot Area",
            labelSoil: "Soil Profile",
            labelWatering: "Watering Mode",
            labelDistrict: "District",
            acres: "acres",
            btnDiagnose: "Diagnose",
            btnIrrigate: "Irrigate"
        },
        es: {
            deleteTitle: "¿Eliminar Parcela?",
            deleteDesc: "¿Está seguro de que desea eliminar",
            deleteSub: "Esta acción no se puede deshacer.",
            btnCancel: "Cancelar",
            btnDelete: "Eliminar",
            unnamed: "Parcela sin nombre",
            cropUnspecified: "Cultivo no especificado",
            labelArea: "Área de Parcela",
            labelSoil: "Perfil de Suelo",
            labelWatering: "Método de Riego",
            labelDistrict: "Distrito",
            acres: "acres",
            btnDiagnose: "Diagnosticar",
            btnIrrigate: "Regar"
        },
        hi: {
            deleteTitle: "प्लॉट हटाएं?",
            deleteDesc: "क्या आप निश्चित रूप से हटाना चाहते हैं",
            deleteSub: "इस कार्रवाई को पूर्ववत नहीं किया जा सकता।",
            btnCancel: "रद्द करें",
            btnDelete: "हटाएं",
            unnamed: "अनाम प्लॉट",
            cropUnspecified: "फसल निर्दिष्ट नहीं",
            labelArea: "प्लॉट क्षेत्र",
            labelSoil: "मिट्टी का प्रकार",
            labelWatering: "सिंचाई विधि",
            labelDistrict: "ज़िला (District)",
            acres: "एकड़",
            btnDiagnose: "निदान",
            btnIrrigate: "सिंचाई"
        }
    };
    const lang = t[language] || t.en;

    return (
        <div className="relative flex flex-col h-full p-6 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group text-left">
            
            {/* Inline Deletion Confirm Overlay */}
            {isConfirming && (
                <div className="absolute inset-0 bg-red-500/95 dark:bg-red-950/95 z-20 flex flex-col justify-center items-center p-6 text-center animate-scale-in">
                    <ShieldAlert size={36} className="text-white dark:text-red-400 mb-3 animate-pulse" />
                    <h4 className="text-lg font-black text-white dark:text-red-300">{lang.deleteTitle}</h4>
                    <p className="text-xs text-white/90 dark:text-red-300/80 mt-1 max-w-[200px] leading-relaxed font-semibold">
                        {lang.deleteDesc} <strong>{plot.name || lang.unnamed}</strong>? {lang.deleteSub}
                    </p>
                    <div className="flex gap-2.5 mt-6 w-full max-w-[220px]">
                        <button
                            onClick={() => setIsConfirming(false)}
                            className="flex-1 py-2 px-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs border-none cursor-pointer flex items-center justify-center gap-1 transition"
                        >
                            <X size={12} />
                            <span>{lang.btnCancel}</span>
                        </button>
                        <button
                            onClick={() => onDelete(plot._id)}
                            className="flex-1 py-2 px-3 bg-white hover:bg-red-50 text-red-700 dark:text-red-400 font-black rounded-xl text-xs border-none cursor-pointer flex items-center justify-center gap-1 transition shadow-md"
                        >
                            <Check size={12} />
                            <span>{lang.btnDelete}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-snug">
                        {plot.name || lang.unnamed}
                    </h3>
                    <span className="inline-block px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold rounded-full uppercase tracking-wider mt-1.5 border border-emerald-100/20">
                        {plot.cropType || lang.cropUnspecified}
                    </span>
                </div>
                <button 
                    onClick={() => setIsConfirming(true)} 
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded-xl border-none cursor-pointer bg-transparent transition duration-200 active:scale-95"
                    title="Delete Plot"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Plot Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-left my-5 text-xs text-slate-500 dark:text-slate-400 border-t border-b border-slate-100 dark:border-gray-800/80 py-4 font-semibold">
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide text-[9px]">{lang.labelArea}</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-350">{plot.area || 0} {lang.acres}</span>
                </div>
                {plot.soilType && (
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide text-[9px]">{lang.labelSoil}</span>
                        <span className="font-extrabold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                            <Layers size={12} className="text-slate-400 shrink-0" />
                            {plot.soilType}
                        </span>
                    </div>
                )}
                {plot.irrigationMethod && (
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide text-[9px]">{lang.labelWatering}</span>
                        <span className="font-extrabold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                            <Droplet size={12} className="text-slate-400 shrink-0" />
                            {plot.irrigationMethod}
                        </span>
                    </div>
                )}
                {plot.location && (
                    <div className="flex flex-col gap-1 truncate">
                        <span className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide text-[9px]">{lang.labelDistrict}</span>
                        <span className="font-extrabold text-slate-700 dark:text-slate-350 flex items-center gap-1 truncate" title={plot.location}>
                            <MapPin size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate">{plot.location}</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Action Buttons (Pushed to the bottom) */}
            <div className="flex gap-2.5 mt-auto">
                <button
                    onClick={() => onDiagnose(plot)}
                    className="flex-1 py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white bg-blue-50 hover:bg-blue-600 dark:bg-blue-950/20 dark:hover:bg-blue-600 rounded-xl transition-all border-none cursor-pointer text-xs"
                >
                    🩺 {lang.btnDiagnose}
                </button>
                <button
                    onClick={() => onIrrigation(plot)}
                    className="flex-1 py-2.5 px-3 font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-sm border-none cursor-pointer transition-all active:scale-95 text-xs"
                >
                    💧 {lang.btnIrrigate}
                </button>
            </div>
        </div>
    );
};

export default PlotCard;