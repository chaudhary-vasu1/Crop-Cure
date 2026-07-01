import { useState, useRef, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';

const ChatBot = () => {
    const { language } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { 
            role: 'model', 
            text: language === 'hi' 
                ? 'नमस्ते! मैं क्रॉपक्योर एआई हूँ। मुझसे फसल, सिंचाई, मिट्टी या कीटों के बारे में कोई भी प्रश्न पूछें।' 
                : language === 'es'
                ? '¡Hola! Soy CropCure AI. Hazme cualquier pregunta agrícola sobre cultivos, riego, suelo o plagas.'
                : 'Hello! I am CropCure AI. Ask me any agricultural question about crops, irrigation, soil, or pests.'
        }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const t = {
        en: {
            title: "CropCure AI",
            subtitle: "Live Agronomist Helper",
            placeholder: "Type a crop question...",
            suggestTitle: "Suggestions:",
            suggest1: "Wheat leaf rust treatment",
            suggest2: "Best soil for sugarcane",
            suggest3: "How to save water in rice cultivation",
            typing: "AI is thinking..."
        },
        es: {
            title: "CropCure AI",
            subtitle: "Asistente Agrónomo",
            placeholder: "Escribe una pregunta...",
            suggestTitle: "Sugerencias:",
            suggest1: "Tratamiento de roya del trigo",
            suggest2: "Suelo para caña de azúcar",
            suggest3: "Cómo ahorrar agua en el arroz",
            typing: "La IA está pensando..."
        },
        hi: {
            title: "क्रॉपक्योर एआई",
            subtitle: "कृषि सलाहकार",
            placeholder: "फसल के बारे में पूछें...",
            suggestTitle: "सुझाव:",
            suggest1: "गेहूं के पत्तों के जंग का इलाज",
            suggest2: "गन्ने के लिए सबसे अच्छी मिट्टी",
            suggest3: "धान की खेती में पानी कैसे बचाएं",
            typing: "एआई सोच रहा है..."
        }
    };
    const lang = t[language] || t.en;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (textToSend) => {
        const query = textToSend || input;
        if (!query.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: query }]);
        setInput('');
        setLoading(true);

        try {
            // Build conversation history format for backend
            const historyList = messages.map(msg => ({
                role: msg.role,
                text: msg.text
            }));

            const response = await api.post('/chat', {
                message: query,
                history: historyList
            });

            setMessages(prev => [...prev, { role: 'model', text: response.data.response }]);
        } catch (err) {
            console.error("ChatBot error:", err);
            setMessages(prev => [...prev, { 
                role: 'model', 
                text: "Sorry, I am having trouble connecting right now. Please try again in a moment." 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col items-end">
            
            {/* Chat Window Panel */}
            {isOpen && (
                <div className="w-[320px] sm:w-[360px] h-[450px] bg-white dark:bg-gray-905 border border-slate-200/50 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4 animate-scale-in text-left">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-650 p-4 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-base shadow-sm">
                                🤖
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white">{lang.title}</h4>
                                <span className="text-[9px] text-emerald-150 font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
                                    {lang.subtitle}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-1 bg-transparent border-none cursor-pointer hover:bg-white/10 rounded-lg text-white"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-grow p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-gray-955/20 scrollbar-thin">
                        {messages.map((msg, idx) => (
                            <div 
                                key={idx} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-emerald-500 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 border border-slate-200/30 dark:border-gray-850 rounded-tl-none'
                                }`}>
                                    {/* Format lines neatly */}
                                    <p className="whitespace-pre-line">{msg.text}</p>
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] p-3 bg-white dark:bg-gray-900 text-slate-400 border border-slate-200/30 dark:border-gray-850 rounded-2xl rounded-tl-none text-xs font-semibold flex items-center gap-1.5">
                                    <Loader2 size={12} className="animate-spin text-emerald-500" />
                                    <span>{lang.typing}</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick suggestions area */}
                    {messages.length === 1 && !loading && (
                        <div className="p-3 bg-white dark:bg-gray-900 border-t border-slate-100 dark:border-gray-850 shrink-0">
                            <p className="text-[9px] font-black uppercase text-slate-450 dark:text-slate-500 tracking-wider mb-2">
                                {lang.suggestTitle}
                            </p>
                            <div className="flex flex-col gap-1.5">
                                {[lang.suggest1, lang.suggest2, lang.suggest3].map((s, sIdx) => (
                                    <button
                                        key={sIdx}
                                        onClick={() => handleSend(s)}
                                        className="text-left px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-gray-950 dark:hover:bg-gray-850 border border-slate-200/30 dark:border-gray-800 rounded-xl text-[10px] font-extrabold text-slate-700 dark:text-slate-350 cursor-pointer transition"
                                    >
                                        💡 {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Field Form */}
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="p-3 bg-white dark:bg-gray-900 border-t border-slate-100 dark:border-gray-800 shrink-0 flex gap-2"
                    >
                        <input
                            type="text"
                            placeholder={lang.placeholder}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                            className="flex-grow px-3 py-2 bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-semibold text-slate-808 dark:text-white"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="w-8 h-8 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-gray-800 text-white rounded-xl border-none cursor-pointer flex items-center justify-center transition active:scale-95 shadow-sm"
                        >
                            <Send size={13} />
                        </button>
                    </form>
                </div>
            )}

            {/* Bubble Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-650 text-white rounded-2xl flex items-center justify-center cursor-pointer border-none shadow-xl hover:scale-105 active:scale-95 transition-all duration-350 group"
                title="CropCure AI Chat"
            >
                {isOpen ? (
                    <X size={20} className="transition-transform duration-200" />
                ) : (
                    <MessageSquare size={20} className="group-hover:rotate-12 transition-transform duration-200" />
                )}
            </button>
        </div>
    );
};

export default ChatBot;
