import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Globe, LifeBuoy, BookOpen, AlertCircle } from 'lucide-react';

const Settings = () => {
    const { language, setLanguage } = useContext(AppContext);

    const t = {
        en: {
            title: "Platform Settings",
            subtitle: "Manage your display language and access platform documentations.",
            langTitle: "Language Preferences",
            langSubtitle: "Select your preferred language for the interface.",
            supportTitle: "Support & Resources",
            docs: "Documentation",
            docsDesc: "Read operational guides for smart watering models.",
            support: "Contact Support",
            supportDesc: "Need help? File an issue or ask our support team.",
            aboutTitle: "About CropCure Assistant",
            aboutDesc: "CropCure is an AI-powered agricultural monitoring platform designed to analyze crop health, compute weather-aware irrigation schedules, and diagnostic histories."
        },
        es: {
            title: "Ajustes de la Plataforma",
            subtitle: "Gestione el idioma de la interfaz y acceda a la documentación.",
            langTitle: "Preferencias de Idioma",
            langSubtitle: "Seleccione su idioma preferido para la interfaz.",
            supportTitle: "Soporte y Recursos",
            docs: "Documentación",
            docsDesc: "Lea guías operativas para los modelos de riego inteligente.",
            support: "Contactar Soporte",
            supportDesc: "¿Necesita ayuda? Presente un problema o consulte al soporte.",
            aboutTitle: "Acerca de CropCure",
            aboutDesc: "CropCure es una plataforma de monitoreo agrícola impulsada por IA diseñada para analizar la salud de los cultivos y calcular programas de riego."
        },
        hi: {
            title: "प्लेटफ़ॉर्म सेटिंग्स",
            subtitle: "भाषा प्राथमिकताएं प्रबंधित करें और दस्तावेज़ों तक पहुंचें।",
            langTitle: "भाषा प्राथमिकताएं",
            langSubtitle: "इंटरफ़ेस के लिए अपनी पसंदीदा भाषा का चयन करें।",
            supportTitle: "समर्थन और संसाधन",
            docs: "दस्तावेज़",
            docsDesc: "स्मार्ट सिंचाई मॉडल के लिए परिचालन मार्गदर्शिकाएँ पढ़ें।",
            support: "समर्थन से संपर्क करें",
            supportDesc: "मदद की ज़रूरत है? समस्या दर्ज करें या हमारी टीम से पूछें।",
            aboutTitle: "क्रॉपक्योर सहायक के बारे में",
            aboutDesc: "क्रॉपक्योर एक एआई-संचालित कृषि निगरानी मंच है जो फसल स्वास्थ्य का विश्लेषण और मौसम-जागरूक सिंचाई शेड्यूल की गणना करता है।"
        }
    };
    const lang = t[language] || t.en;

    return (
        <div className="max-w-4xl mx-auto mt-6 text-left animate-slide-up">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                    {lang.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                    {lang.subtitle}
                </p>
            </div>

            <div className="space-y-6">
                {/* 🌍 Language Section */}
                <div className="p-6 sm:p-8 bg-white border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm dark:bg-gray-900">
                    <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-100 dark:border-gray-800">
                        <Globe className="text-emerald-500 shrink-0" size={18}/>
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">{lang.langTitle}</h3>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 dark:bg-gray-950 rounded-2xl border border-slate-200/20 dark:border-gray-800/20">
                        <div>
                            <p className="text-sm font-extrabold text-slate-800 dark:text-white">Display Language</p>
                            <p className="text-xs text-slate-400 dark:text-slate-550 mt-0.5 font-semibold">{lang.langSubtitle}</p>
                        </div>
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
                        >
                            <option value="en">English (US)</option>
                            <option value="es">Español</option>
                            <option value="hi">हिंदी (Hindi)</option>
                        </select>
                    </div>
                </div>

                {/* 📘 Support and Resources */}
                <div className="p-6 sm:p-8 bg-white border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm dark:bg-gray-900">
                    <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-100 dark:border-gray-800">
                        <LifeBuoy className="text-emerald-500 shrink-0" size={18}/>
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">{lang.supportTitle}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a 
                            href="https://github.com/chaudhary-vasu1/Crop-Cure" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-start gap-4 p-5 bg-slate-50 hover:bg-slate-100/60 dark:bg-gray-950 dark:hover:bg-gray-950/80 rounded-2xl border border-slate-200/20 dark:border-gray-800/20 transition-all border-none text-current no-underline group shadow-sm"
                        >
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-xl text-blue-500 group-hover:scale-105 transition-transform duration-200">
                                <BookOpen size={18} />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">{lang.docs}</h4>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold leading-relaxed">{lang.docsDesc}</p>
                            </div>
                        </a>
                        <a 
                            href="mailto:support@cropcure.example.com"
                            className="flex items-start gap-4 p-5 bg-slate-50 hover:bg-slate-100/60 dark:bg-gray-950 dark:hover:bg-gray-950/80 rounded-2xl border border-slate-200/20 dark:border-gray-800/20 transition-all border-none text-current no-underline group shadow-sm"
                        >
                            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl text-emerald-500 group-hover:scale-105 transition-transform duration-200">
                                <LifeBuoy size={18} />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">{lang.support}</h4>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold leading-relaxed">{lang.supportDesc}</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* ℹ️ About Section */}
                <div className="p-6 sm:p-8 bg-white border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm dark:bg-gray-905">
                    <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-gray-800">
                        <AlertCircle className="text-emerald-500 shrink-0" size={18}/>
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">{lang.aboutTitle}</h3>
                    </div>
                    <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
                        {lang.aboutDesc}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;