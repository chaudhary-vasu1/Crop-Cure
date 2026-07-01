import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { ArrowLeft, BookOpen, ShieldAlert, Sparkles, Shield, Loader2 } from 'lucide-react';

const KnowledgeBase = () => {
    const { language } = useContext(AppContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState('wheat');
    const [article, setArticle] = useState(null);

    const t = {
        en: {
            title: "📖 Agricultural Knowledge Base",
            subtitle: "Expert crop guides, disease diagnoses reference manuals, and treatments schedules",
            topicWheat: "Wheat Guide",
            topicRice: "Rice Guide",
            topicSugarcane: "Sugarcane",
            topicGeneral: "General Management",
            cardOrganic: "Organic & Preventive Remedies",
            cardChemical: "Recommended Chemical Treatments",
            backForum: "Back to Forum"
        },
        es: {
            title: "📖 Base de Conocimiento",
            subtitle: "Guías de expertos sobre cultivos, manuales de diagnóstico y tratamientos",
            topicWheat: "Trigo",
            topicRice: "Arroz",
            topicSugarcane: "Caña de Azúcar",
            topicGeneral: "Manejo General",
            cardOrganic: "Remedios Orgánicos y Preventivos",
            cardChemical: "Tratamientos Químicos Recomendados",
            backForum: "Volver al Foro"
        },
        hi: {
            title: "📖 कृषि ज्ञानकोष (Knowledge Base)",
            subtitle: "विशेषज्ञ फसल मार्गदर्शिकाएँ, रोग निदान संदर्भ पुस्तिकाएं और उपचार कार्यक्रम",
            topicWheat: "गेहूं गाइड",
            topicRice: "धान गाइड",
            topicSugarcane: "गन्ना गाइड",
            topicGeneral: "सामान्य प्रबंधन",
            cardOrganic: "जैविक और निवारक उपाय",
            cardChemical: "अनुशंसित रासायनिक उपचार",
            backForum: "सामुदायिक मंच पर वापस"
        }
    };
    const lang = t[language] || t.en;

    const fetchArticle = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/forum/knowledge-base/${selectedTopic}`);
            setArticle(response.data);
        } catch (error) {
            console.error("Failed to load KB guide:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticle();
    }, [selectedTopic]);

    return (
        <div className="container mx-auto px-4 py-8 text-left max-w-4xl">
            <button 
                onClick={() => navigate('/forum')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-550 dark:text-slate-400 bg-transparent border-none p-0 cursor-pointer hover:text-emerald-500 mb-6 transition"
            >
                <ArrowLeft size={14} /> {lang.backForum}
            </button>

            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {lang.title}
            </h2>
            <p className="text-xs text-slate-450 dark:text-slate-550 font-semibold mt-1 mb-8">
                {lang.subtitle}
            </p>

            {/* Topic Switcher Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1.5 border-b border-slate-100 dark:border-gray-800 mb-6">
                {[
                    { key: 'wheat', label: lang.topicWheat },
                    { key: 'rice', label: lang.topicRice },
                    { key: 'sugarcane', label: lang.topicSugarcane },
                    { key: 'general', label: lang.topicGeneral }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setSelectedTopic(tab.key)}
                        className={`px-4 py-3 text-xs font-extrabold border-none bg-transparent cursor-pointer transition relative ${
                            selectedTopic === tab.key
                                ? 'text-emerald-500 font-black'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <span>{tab.label}</span>
                        {selectedTopic === tab.key && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center py-32 gap-3 text-slate-400">
                    <Loader2 size={32} className="animate-spin text-emerald-500" />
                    <p className="text-xs font-bold font-mono">Retrieving agronomist documentation...</p>
                </div>
            ) : article ? (
                <div className="space-y-6 animate-fade-in">
                    
                    {/* General explanation text */}
                    <div className="p-6 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/55 rounded-3xl shadow-sm text-xs leading-relaxed space-y-3 font-semibold text-slate-650 dark:text-slate-300">
                        <h3 className="text-sm font-black text-slate-805 dark:text-slate-100 flex items-center gap-1.5">
                            <BookOpen size={16} className="text-emerald-500" />
                            {article.title}
                        </h3>
                        <p>{article.content}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Organic Remedy card */}
                        <div className="p-6 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/55 rounded-3xl shadow-sm space-y-4">
                            <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-450 flex items-center gap-1.5 uppercase tracking-wider">
                                <Sparkles size={14} />
                                {lang.cardOrganic}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                                {article.organicRemedies}
                            </p>
                        </div>

                        {/* Chemical Remedy card */}
                        <div className="p-6 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/55 rounded-3xl shadow-sm space-y-4">
                            <h4 className="text-xs font-black text-blue-600 dark:text-blue-450 flex items-center gap-1.5 uppercase tracking-wider">
                                <Shield size={14} />
                                {lang.cardChemical}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                                {article.chemicalRemedies}
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default KnowledgeBase;
