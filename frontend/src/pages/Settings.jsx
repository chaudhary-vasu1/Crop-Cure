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
        <div className="max-w-4xl mx-auto mt-6 text-left">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">
                    {lang.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {lang.subtitle}
                </p>
            </div>

            <div className="space-y-6">
                {/* 🌍 Language Section */}
                <div className="p-6 sm:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center gap-2 pb-3 mb-6 border-b border-gray-100 dark:border-gray-700">
                        <Globe className="text-gray-500 dark:text-gray-400" size={20}/>
                        <h3 className="text-lg font-bold text-gray-850 dark:text-gray-205">{lang.langTitle}</h3>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl dark:bg-gray-900/50">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-white">Display Language</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lang.langSubtitle}</p>
                        </div>
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-4 py-2.5 font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl outline-none cursor-pointer hover:border-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-100 text-sm"
                        >
                            <option value="en">English (US)</option>
                            <option value="es">Español</option>
                            <option value="hi">हिंदी (Hindi)</option>
                        </select>
                    </div>
                </div>

                {/* 📘 Support and Resources (Inspired by SymptoGenie Support links) */}
                <div className="p-6 sm:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center gap-2 pb-3 mb-6 border-b border-gray-100 dark:border-gray-700">
                        <LifeBuoy className="text-gray-500 dark:text-gray-400" size={20}/>
                        <h3 className="text-lg font-bold text-gray-850 dark:text-gray-205">{lang.supportTitle}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a 
                            href="https://github.com/chaudhary-vasu1/Crop-Cure" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/50 dark:hover:bg-gray-900/80 rounded-xl border border-gray-100 dark:border-gray-800/80 transition text-current no-underline"
                        >
                            <BookOpen size={24} className="text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-white text-sm">{lang.docs}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{lang.docsDesc}</p>
                            </div>
                        </a>
                        <a 
                            href="mailto:support@cropcure.example.com"
                            className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/50 dark:hover:bg-gray-900/80 rounded-xl border border-gray-100 dark:border-gray-800/80 transition text-current no-underline"
                        >
                            <LifeBuoy size={24} className="text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-white text-sm">{lang.support}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{lang.supportDesc}</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* ℹ️ About Section */}
                <div className="p-6 sm:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100 dark:border-gray-700">
                        <AlertCircle className="text-gray-500 dark:text-gray-400" size={20}/>
                        <h3 className="text-lg font-bold text-gray-850 dark:text-gray-205">{lang.aboutTitle}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {lang.aboutDesc}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;