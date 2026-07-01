import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { X, Loader2 } from 'lucide-react';

const NewPostModal = ({ isOpen, onClose }) => {
    const { language } = useContext(AppContext);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'general',
        content: '',
        cropType: 'General',
        location: ''
    });

    const t = {
        en: {
            title: "🤝 Ask the Community",
            lblTitle: "Discussion Title",
            lblCat: "Topic Category",
            lblContent: "Details / Symptoms",
            lblCrop: "Crop Type Affected",
            lblLoc: "Location / Region",
            btnPost: "Post Question",
            btnCancel: "Cancel",
            posting: "Posting..."
        },
        es: {
            title: "🤝 Preguntar a la Comunidad",
            lblTitle: "Título de la Discusión",
            lblCat: "Categoría del Tema",
            lblContent: "Detalles / Síntomas",
            lblCrop: "Tipo de Cultivo Afectado",
            lblLoc: "Ubicación / Región",
            btnPost: "Publicar Pregunta",
            btnCancel: "Cancelar",
            posting: "Publicando..."
        },
        hi: {
            title: "🤝 समुदाय से पूछें",
            lblTitle: "चर्चा का शीर्षक",
            lblCat: "विषय की श्रेणी",
            lblContent: "विवरण / लक्षण",
            lblCrop: "प्रभावित फसल का प्रकार",
            lblLoc: "स्थान / क्षेत्र",
            btnPost: "प्रश्न पोस्ट करें",
            btnCancel: "रद्द करें",
            posting: "पोस्ट किया जा रहा है..."
        }
    };
    const lang = t[language] || t.en;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/forum/posts', formData);
            onClose();
        } catch (err) {
            console.error("Failed to post question:", err);
            alert("Error submitting question.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fade-in text-left">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl p-6 shadow-2xl overflow-hidden relative animate-scale-in">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-gray-800">
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                        {lang.title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 bg-transparent border-none cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg text-slate-450"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                            {lang.lblTitle}
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. White spots appearing on sugarcane leaves"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-semibold text-slate-808 dark:text-white"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                                {lang.lblCat}
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
                            >
                                <option value="general">General Discuss</option>
                                <option value="disease">Disease Issues</option>
                                <option value="pest">Pest Outbreaks</option>
                                <option value="treatment">Treatments</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                                {lang.lblCrop}
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Sugarcane, Wheat"
                                value={formData.cropType}
                                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                                className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-semibold text-slate-800 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                            {lang.lblLoc}
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Meerut, Uttar Pradesh"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-semibold text-slate-808 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                            {lang.lblContent}
                        </label>
                        <textarea
                            rows="4"
                            placeholder="Describe symptoms, watering pattern, when it started..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-semibold text-slate-808 dark:text-white resize-none"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-slate-700 dark:text-white rounded-xl text-xs font-bold border-none cursor-pointer transition"
                        >
                            {lang.btnCancel}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white rounded-xl text-xs font-bold border-none cursor-pointer transition flex items-center justify-center gap-1.5"
                        >
                            {loading ? <Loader2 size={13} className="animate-spin" /> : lang.btnPost}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewPostModal;
