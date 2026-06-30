import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PlotCard from '../components/PlotCard';
import AddPlotModal from '../components/AddPlotModal';
import DiagnoseModal from '../components/DiagnoseModal';
import IrrigationModal from '../components/IrrigationModal';
import WeatherWidget from '../components/WeatherWidget';

const Dashboard = () => {
    const { language } = useContext(AppContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Translations mapping
    const t = {
        en: { 
            title: "My Farm Plots", 
            addPlot: "+ Add Plot", 
            loading: "Loading your plots...", 
            empty: "You haven't added any plots yet.",
            confirmDelete: "Are you sure you want to delete this plot?",
            failedDelete: "Failed to delete plot",
            welcome: "Welcome,",
            subtitle: "Your AI-powered agricultural assistant is ready to help you optimize farm health. Diagnose plant diseases, schedule smart watering, and inspect crop analytics.",
            coreTools: "Core Farming Tools",
            coreSubtitle: "Everything you need to manage crop health and water efficiency",
            diagTitle: "AI Leaf Diagnosis",
            diagDesc: "Upload photos of sick crop leaves to diagnose diseases, contagiousness risks, and organic remedies.",
            diagBtn: "Diagnose Now →",
            irrigTitle: "Smart Irrigation",
            irrigDesc: "Compute customized watering guidelines based on temperature, rain volume, soil type, and method.",
            irrigBtn: "Get Advice →",
            weatherTitle: "Weather Center",
            weatherDesc: "Monitor live forecasts, wind speed, and humidity indicators for Meerut, Delhi, or custom locations.",
            weatherBtn: "Check Forecast →",
            analyticsTitle: "Crops Analytics",
            analyticsDesc: "Inspect diagnostic histories, check contagion percentages, and review treatment progress metrics.",
            analyticsBtn: "View Timeline →"
        },
        es: {
            title: "Mis Parcelas de Campo",
            addPlot: "+ Añadir Parcela",
            loading: "Cargando sus parcelas...",
            empty: "Aún no ha añadido ninguna parcela.",
            confirmDelete: "¿Está seguro de que desea eliminar esta parcela?",
            failedDelete: "Error al eliminar la parcela",
            welcome: "¡Bienvenido,",
            subtitle: "Su asistente agrícola impulsado por IA está listo para ayudarle a optimizar la salud del campo. Diagnostique enfermedades, programe el riego y analice cultivos.",
            coreTools: "Herramientas Agrícolas Clave",
            coreSubtitle: "Todo lo que necesita para gestionar la salud del cultivo y la eficiencia del agua",
            diagTitle: "Diagnóstico de Hojas por IA",
            diagDesc: "Suba fotos de hojas enfermas para diagnosticar enfermedades, riesgos de contagio y remedios orgánicos.",
            diagBtn: "Diagnosticar Ahora →",
            irrigTitle: "Riego Inteligente",
            irrigDesc: "Calcule pautas de riego personalizadas basadas en la temperatura, lluvia, tipo de suelo y método.",
            irrigBtn: "Ver Asesoramiento →",
            weatherTitle: "Centro Meteorológico",
            weatherDesc: "Monitoree pronósticos en vivo, velocidad del viento y humedad para Meerut, Delhi o ubicaciones personalizadas.",
            weatherBtn: "Ver Clima →",
            analyticsTitle: "Análisis de Cultivos",
            analyticsDesc: "Inspeccione historiales de diagnóstico, tasas de contagio y métricas de progreso de tratamientos.",
            analyticsBtn: "Ver Historial →"
        },
        hi: { 
            title: "मेरे खेत के प्लॉट", 
            addPlot: "+ प्लॉट जोड़ें", 
            loading: "आपके प्लॉट लोड हो रहे हैं...", 
            empty: "आपने अभी तक कोई प्लॉट नहीं जोड़ा है।",
            confirmDelete: "क्या आप वाकई इस प्लॉट को हटाना चाहते हैं?",
            failedDelete: "प्लॉट हटाने में विफल",
            welcome: "स्वागत है,",
            subtitle: "आपका एआई-संचालित कृषि सहायक आपकी खेत की सेहत को बेहतर बनाने के लिए तैयार है। फसलों के रोगों का निदान करें, स्मार्ट सिंचाई शेड्यूल करें और विश्लेषण देखें।",
            coreTools: "मुख्य कृषि उपकरण",
            coreSubtitle: "फसल स्वास्थ्य और जल दक्षता का प्रबंधन करने के लिए आपकी जरूरत की हर चीज",
            diagTitle: "एआई पत्ती निदान",
            diagDesc: "रोगों, संक्रामक खतरों और जैविक उपचारों का निदान करने के लिए बीमार पत्ती की तस्वीरें अपलोड करें।",
            diagBtn: "अभी निदान करें →",
            irrigTitle: "स्मार्ट सिंचाई",
            irrigDesc: "तापमान, वर्षा, मिट्टी के प्रकार और सिंचाई विधि के आधार पर कस्टम सिंचाई दिशानिर्देश प्राप्त करें।",
            irrigBtn: "सिंचाई सलाह →",
            weatherTitle: "मौसम केंद्र",
            weatherDesc: "मेरठ, दिल्ली या किसी भी शहर के लिए लाइव पूर्वानुमान, हवा की गति और आर्द्रता के संकेतकों की निगरानी करें।",
            weatherBtn: "मौसम देखें →",
            analyticsTitle: "फसल विश्लेषण",
            analyticsDesc: "पिछले पत्ती रोगों के इतिहास, संक्रामक दर और उपचार प्रगति के आंकड़ों की समीक्षा करें।",
            analyticsBtn: "टाइमलाइन देखें →"
        }
    };
    const lang = t[language] || t.en;

    const [plots, setPlots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedPlotForDiagnosis, setSelectedPlotForDiagnosis] = useState(null);
    const [selectedPlotForIrrigation, setSelectedPlotForIrrigation] = useState(null);

    useEffect(() => {
        const fetchPlots = async () => {
            try {
                const response = await api.get('/plots');
                setPlots(response.data);
            } catch (error) {
                console.error('Error fetching plots:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlots();
    }, []);

    const handleDeletePlot = async (id) => {
        if (!window.confirm(lang.confirmDelete)) return;
        try {
            await api.delete(`/plots/${id}`);
            setPlots(plots.filter(plot => plot._id !== id));
        } catch (error) {
            console.error('Error deleting plot:', error);
            alert(lang.failedDelete);
        }
    };

    const handlePlotAdded = (newPlot) => {
        setPlots([newPlot, ...plots]);
    };

    const defaultCity = plots.length > 0 && plots[0].location ? plots[0].location.split(',')[0].trim() : undefined;

    return (
        <div className="w-full text-left">
            {/* Hero / Welcome section */}
            <div className="relative p-8 mb-8 text-white rounded-3xl shadow-lg bg-gradient-to-r from-green-700 via-emerald-600 to-teal-650 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="z-10 text-left max-w-xl">
                    <h1 className="text-3xl sm:text-4xl font-black mb-3">
                        {lang.welcome} {user?.username || 'Farmer'}! 🌾👋
                    </h1>
                    <p className="text-sm sm:text-base font-medium opacity-90 leading-relaxed mb-6">
                        {lang.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button
                            disabled={loading}
                            onClick={() => {
                                if (plots.length > 0) {
                                    setSelectedPlotForDiagnosis(plots[0]);
                                } else {
                                    setIsModalOpen(true);
                                }
                            }}
                            className="px-5 py-2.5 bg-white text-green-700 hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 font-bold rounded-xl shadow-md border-none cursor-pointer transition transform hover:scale-[1.03] text-sm"
                        >
                            Diagnose Leaf 🩺
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-5 py-2.5 bg-transparent text-white border-2 border-white/80 font-bold rounded-xl cursor-pointer hover:bg-white/10 transition transform hover:scale-[1.03] text-sm"
                        >
                            {lang.addPlot} 🚜
                        </button>
                    </div>
                </div>
                <div className="hidden md:flex flex-col items-center gap-1 z-10 select-none">
                    <span className="text-8xl filter drop-shadow-md">🚜</span>
                    <span className="text-xs uppercase tracking-widest font-black opacity-75">CropCure AI Assistant</span>
                </div>
                <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* Core Farming Tools Section */}
            <div className="mb-10 text-left">
                <h2 className="text-2xl font-black text-gray-850 dark:text-white">{lang.coreTools}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lang.coreSubtitle}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {/* Diagnose Tool (Green) */}
                    <div className="flex flex-col justify-between p-6 bg-white dark:bg-gray-800 border border-green-100 dark:border-green-950/40 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-green-400 dark:hover:border-green-700 transition duration-300 group">
                        <div>
                            <span className="text-4xl">🩺</span>
                            <h3 className="text-lg font-bold text-gray-850 dark:text-white mt-4">{lang.diagTitle}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{lang.diagDesc}</p>
                        </div>
                        <button 
                            disabled={loading}
                            onClick={() => {
                                console.log("AI Diagnose clicked. Plots:", plots);
                                if (plots.length > 0) {
                                    setSelectedPlotForDiagnosis(plots[0]);
                                } else {
                                    setIsModalOpen(true);
                                }
                            }}
                            className="w-full mt-6 py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 font-bold rounded-xl text-xs border-none cursor-pointer shadow-sm group-hover:scale-[1.02] transition"
                        >
                            {loading ? "Loading..." : lang.diagBtn}
                        </button>
                    </div>

                    {/* Irrigation Advice Tool (Blue) */}
                    <div className="flex flex-col justify-between p-6 bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-950/40 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-700 transition duration-300 group">
                        <div>
                            <span className="text-4xl">💧</span>
                            <h3 className="text-lg font-bold text-gray-850 dark:text-white mt-4">{lang.irrigTitle}</h3>
                            <p className="text-xs text-gray-505 dark:text-gray-400 mt-2 leading-relaxed">{lang.irrigDesc}</p>
                        </div>
                        <button 
                            disabled={loading}
                            onClick={() => {
                                console.log("Smart Irrigation clicked. Plots:", plots);
                                if (plots.length > 0) {
                                    setSelectedPlotForIrrigation(plots[0]);
                                } else {
                                    setIsModalOpen(true);
                                }
                            }}
                            className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 font-bold rounded-xl text-xs border-none cursor-pointer shadow-sm group-hover:scale-[1.02] transition"
                        >
                            {loading ? "Loading..." : lang.irrigBtn}
                        </button>
                    </div>

                    {/* Weather Tool (Teal) */}
                    <div className="flex flex-col justify-between p-6 bg-white dark:bg-gray-800 border border-cyan-100 dark:border-cyan-950/40 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-cyan-400 dark:hover:border-cyan-700 transition duration-300 group">
                        <div>
                            <span className="text-4xl">🌦️</span>
                            <h3 className="text-lg font-bold text-gray-850 dark:text-white mt-4">{lang.weatherTitle}</h3>
                            <p className="text-xs text-gray-505 dark:text-gray-400 mt-2 leading-relaxed">{lang.weatherDesc}</p>
                        </div>
                        <button 
                            onClick={() => {
                                const weatherWidget = document.getElementById('weather-widget-container');
                                if (weatherWidget) {
                                    weatherWidget.scrollIntoView({ behavior: 'smooth' });
                                }
                                setTimeout(() => {
                                    const changeCityBtn = document.getElementById('change-city-btn');
                                    if (changeCityBtn) {
                                        changeCityBtn.click();
                                    }
                                }, 350);
                            }}
                            className="w-full mt-6 py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs border-none cursor-pointer shadow-sm group-hover:scale-[1.02] transition"
                        >
                            {lang.weatherBtn}
                        </button>
                    </div>

                    {/* Analytics Timeline Tool (Purple) */}
                    <div className="flex flex-col justify-between p-6 bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-950/40 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-purple-400 dark:hover:border-purple-700 transition duration-300 group">
                        <div>
                            <span className="text-4xl">📊</span>
                            <h3 className="text-lg font-bold text-gray-850 dark:text-white mt-4">{lang.analyticsTitle}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{lang.analyticsDesc}</p>
                        </div>
                        <button 
                            onClick={() => navigate('/crops')}
                            className="w-full mt-6 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs border-none cursor-pointer shadow-sm group-hover:scale-[1.02] transition"
                        >
                            {lang.analyticsBtn}
                        </button>
                    </div>
                </div>
            </div>

            {/* Weather Widget */}
            <div id="weather-widget-container" className="scroll-mt-20">
                <WeatherWidget defaultCity={defaultCity} />
            </div>



            <AddPlotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPlotAdded={handlePlotAdded} />
            <DiagnoseModal isOpen={!!selectedPlotForDiagnosis} onClose={() => setSelectedPlotForDiagnosis(null)} plot={selectedPlotForDiagnosis} />
            <IrrigationModal isOpen={!!selectedPlotForIrrigation} onClose={() => setSelectedPlotForIrrigation(null)} plot={selectedPlotForIrrigation} />
        </div>
    );
};

export default Dashboard;