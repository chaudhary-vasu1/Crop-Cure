import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { Check, Loader2, Sparkles, Zap, ShieldAlert } from 'lucide-react';

const PricingPage = () => {
    const { language, refreshFarms } = useContext(AppContext);
    const navigate = useNavigate();

    const [upgrading, setUpgrading] = useState(null);

    const t = {
        en: {
            title: "💎 Choose Your Monitoring Plan",
            subtitle: "Optimize water, safeguard crops, and manage multiple fields with expert insights",
            popular: "Most Popular",
            btnSelect: "Get Started",
            btnActive: "Current Plan",
            upgradingText: "Processing payment...",
            upgradeSuccess: "Upgrade successful! Enjoy your new features.",
            freeName: "Free Plan",
            premName: "Premium Plan",
            proName: "Professional Plan"
        },
        es: {
            title: "💎 Elija Su Plan de Monitoreo",
            subtitle: "Optimice el agua, proteja los cultivos y gestione múltiples campos",
            popular: "Más Popular",
            btnSelect: "Empezar",
            btnActive: "Plan Actual",
            upgradingText: "Procesando pago...",
            upgradeSuccess: "¡Actualización exitosa! Disfrute de sus nuevas funciones.",
            freeName: "Plan Gratis",
            premName: "Plan Premium",
            proName: "Plan Profesional"
        },
        hi: {
            title: "💎 अपनी निगरानी योजना चुनें",
            subtitle: "पानी का सही उपयोग करें, फसलों को सुरक्षित रखें, और अधिक खेतों का प्रबंधन करें",
            popular: "सबसे लोकप्रिय",
            btnSelect: "शुरू करें",
            btnActive: "वर्तमान योजना",
            upgradingText: "भुगतान संसाधित किया जा रहा है...",
            upgradeSuccess: "अपग्रेड सफल रहा! नई सुविधाओं का आनंद लें।",
            freeName: "मुफ़्त योजना (Free)",
            premName: "प्रीमियम योजना ($4.99)",
            proName: "व्यावसायिक योजना ($9.99)"
        }
    };
    const lang = t[language] || t.en;

    const currentTier = localStorage.getItem('userTier') || 'free';

    const handleUpgrade = async (tierName) => {
        if (tierName === currentTier) return;
        setUpgrading(tierName);
        try {
            const response = await api.post('/subscription/upgrade', { tier: tierName });
            // Sync local storage tier
            localStorage.setItem('userTier', tierName);
            
            // Re-fetch farms/context to update limits
            await refreshFarms();
            
            alert(lang.upgradeSuccess);
            navigate('/');
        } catch (err) {
            console.error("Upgrade failed:", err);
            alert("Upgrade transaction failed. Please try again.");
        } finally {
            setUpgrading(null);
        }
    };

    const tiers = [
        {
            key: 'free',
            name: lang.freeName,
            price: "₹0",
            period: "/month",
            features: [
                "Basic AI Disease Diagnosis (1 per day)",
                "Access to past 5 diagnosis scans history",
                "Real-time local weather reports",
                "Community forum reading and upvoting"
            ],
            icon: <Zap size={20} className="text-slate-400" />,
            badge: null,
            btnStyle: "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
        },
        {
            key: 'premium',
            name: lang.premName,
            price: "₹399",
            period: "/month",
            features: [
                "Unlimited AI Disease Diagnoses",
                "Lifetime diagnostic scans history log",
                "Daily push/email weather alerts",
                "Smart volumetric irrigation calculator",
                "Pest & Disease predictions (weekly)",
                "Export diagnostics reports as PDF"
            ],
            icon: <Sparkles size={20} className="text-emerald-500" />,
            badge: lang.popular,
            btnStyle: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
        },
        {
            key: 'professional',
            name: lang.proName,
            price: "₹799",
            period: "/month",
            features: [
                "All Premium features included",
                "Multi-farm management (up to 5 fields)",
                "AI Personalized crop recommendations",
                "Critical SMS pest infestation alerts",
                "Direct advisory chat with Agronomists",
                "Exclusive agri-marketplace deals"
            ],
            icon: <Zap size={20} className="text-indigo-500 animate-bounce" />,
            badge: null,
            btnStyle: "bg-indigo-650 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8 text-left max-w-5xl">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-slate-805 dark:text-white leading-tight">
                    {lang.title}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-2.5 leading-relaxed">
                    {lang.subtitle}
                </p>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier) => {
                    const isActive = currentTier === tier.key;
                    return (
                        <div 
                            key={tier.key} 
                            className={`flex flex-col justify-between p-6 bg-white dark:bg-gray-900 border rounded-3xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                                tier.badge 
                                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                                    : 'border-slate-200/50 dark:border-gray-800/50 shadow-sm'
                            }`}
                        >
                            {/* Popular Ribbon/Badge */}
                            {tier.badge && (
                                <div className="absolute top-3 right-3 bg-emerald-500 text-white font-black text-[9px] uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                                    {tier.badge}
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    {tier.icon}
                                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">{tier.name}</h3>
                                </div>

                                <div className="flex items-baseline gap-1 mb-6 border-b border-slate-50 dark:border-gray-850 pb-4">
                                    <span className="text-2xl font-black text-slate-808 dark:text-white">{tier.price}</span>
                                    <span className="text-xs text-slate-450 dark:text-slate-550 font-bold">{tier.period}</span>
                                </div>

                                <ul className="space-y-3 pl-0 list-none text-xs font-semibold text-slate-550 dark:text-slate-400">
                                    {tier.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-2 leading-relaxed">
                                            <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 border-t border-slate-50 dark:border-gray-850 pt-4">
                                <button
                                    onClick={() => handleUpgrade(tier.key)}
                                    disabled={isActive || upgrading !== null}
                                    className={`w-full py-2.5 rounded-2xl font-black text-xs border-none cursor-pointer flex items-center justify-center gap-1.5 transition ${
                                        isActive 
                                            ? 'bg-slate-100 text-slate-450 dark:bg-gray-950 dark:text-gray-600 cursor-default'
                                            : tier.btnStyle
                                    }`}
                                >
                                    {upgrading === tier.key ? (
                                        <>
                                            <Loader2 size={13} className="animate-spin" />
                                            <span>{lang.upgradingText}</span>
                                        </>
                                    ) : isActive ? (
                                        lang.btnActive
                                    ) : (
                                        lang.btnSelect
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PricingPage;
