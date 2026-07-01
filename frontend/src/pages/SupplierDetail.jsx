import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { ArrowLeft, Star, Phone, MapPin, ShieldCheck, MessageSquare, Loader2, Tag } from 'lucide-react';

const SupplierDetail = () => {
    const { supplierId } = useParams();
    const { language, addToCart } = useContext(AppContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [supplier, setSupplier] = useState(null);
    const [supplierProducts, setSupplierProducts] = useState([]);
    
    // Review form states
    const [ratingInput, setRatingInput] = useState(5);
    const [commentInput, setCommentInput] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const t = {
        en: {
            verified: "Verified Vendor",
            contact: "Contact Phone:",
            rating: "Average Rating:",
            reviewTitle: "Reviews & Feedback",
            reviewPlaceholder: "Share your experience with this supplier...",
            submitReview: "Submit Feedback",
            productsTitle: "Catalog from this Vendor",
            reviewsEmpty: "No feedback submitted yet. Be the first!",
            addToCartBtn: "Add to Cart",
            backMarket: "Back to Marketplace"
        },
        es: {
            verified: "Proveedor Verificado",
            contact: "Teléfono de Contacto:",
            rating: "Calificación Promedio:",
            reviewTitle: "Opiniones y Comentarios",
            reviewPlaceholder: "Comparta su experiencia con este proveedor...",
            submitReview: "Enviar Comentario",
            productsTitle: "Catálogo de este Proveedor",
            reviewsEmpty: "Aún no hay comentarios. ¡Sé el primero!",
            addToCartBtn: "Añadir al Carrito",
            backMarket: "Volver al Mercado"
        },
        hi: {
            verified: "सत्यापित विक्रेता",
            contact: "संपर्क फोन:",
            rating: "औसत रेटिंग:",
            reviewTitle: "समीक्षा और प्रतिक्रिया",
            reviewPlaceholder: "इस आपूर्तिकर्ता के साथ अपना अनुभव साझा करें...",
            submitReview: "प्रतिक्रिया सबमिट करें",
            productsTitle: "इस विक्रेता के उत्पाद",
            reviewsEmpty: "अभी तक कोई समीक्षा नहीं। पहले बनें!",
            addToCartBtn: "कार्ट में जोड़ें",
            backMarket: "बाजार में वापस"
        }
    };
    const lang = t[language] || t.en;

    const fetchData = async () => {
        setLoading(true);
        try {
            const supplierRes = await api.get(`/marketplace/suppliers/${supplierId}`);
            setSupplier(supplierRes.data);

            const productsRes = await api.get(`/marketplace/products`);
            // Filter products matching this supplier
            const filtered = productsRes.data.filter(p => p.supplierId?._id === supplierId);
            setSupplierProducts(filtered);
        } catch (error) {
            console.error("Failed to load supplier details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [supplierId]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            await api.post(`/marketplace/suppliers/${supplierId}/review`, {
                rating: ratingInput,
                comment: commentInput
            });
            setCommentInput('');
            setRatingInput(5);
            fetchData(); // Reload stats & reviews list
        } catch (err) {
            console.error("Failed to post feedback:", err);
            alert("Feedback submission failed.");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-32 gap-3 text-slate-400">
                <Loader2 size={32} className="animate-spin text-emerald-500" />
                <p className="text-xs font-bold">Retrieving supplier card...</p>
            </div>
        );
    }

    if (!supplier) return null;

    return (
        <div className="container mx-auto px-4 py-8 text-left">
            <button 
                onClick={() => navigate('/marketplace')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-550 dark:text-slate-400 bg-transparent border-none cursor-pointer hover:text-emerald-500 mb-6 transition"
            >
                <ArrowLeft size={14} /> {lang.backMarket}
            </button>

            {/* Supplier Profile Card */}
            <div className="p-6 md:p-8 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm mb-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100">
                                {supplier.name}
                            </h2>
                            {supplier.verified && (
                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-250/25 text-[9px] font-black rounded-full flex items-center gap-0.5 tracking-wider uppercase">
                                    <ShieldCheck size={11} /> {lang.verified}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 text-xs font-semibold text-slate-550 dark:text-slate-400">
                            <span className="flex items-center gap-1"><MapPin size={13} className="text-emerald-500" /> {supplier.location}</span>
                            <span className="flex items-center gap-1"><Phone size={13} className="text-emerald-500" /> {supplier.contactPhone}</span>
                        </div>
                    </div>

                    {/* Stats rating badge */}
                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-gray-950 rounded-2xl border border-slate-200/10 dark:border-gray-850 shrink-0">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                            <Star size={18} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">{lang.rating}</p>
                            <p className="text-sm font-black text-slate-800 dark:text-white mt-0.5">{supplier.rating} / 5</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Catalog (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        📦 {lang.productsTitle}
                    </h3>
                    
                    {supplierProducts.length === 0 ? (
                        <div className="p-12 text-center text-xs font-semibold text-slate-400 border border-dashed border-slate-200 dark:border-gray-800 rounded-3xl">
                            This vendor has not posted any products.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {supplierProducts.map((p) => (
                                <div key={p._id} className="flex flex-col bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm overflow-hidden text-left">
                                    <div className="h-36 bg-slate-50 dark:bg-gray-950 overflow-hidden relative">
                                        {p.image ? (
                                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">🌱</div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 line-clamp-1">
                                                {p.name}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-0.5 line-clamp-2">
                                                {p.description}
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-slate-50 dark:border-gray-850 flex items-center justify-between">
                                            <span className="text-sm font-black text-slate-805 dark:text-white">₹{p.price}</span>
                                            <button
                                                onClick={() => addToCart(p)}
                                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] rounded-lg border-none cursor-pointer transition active:scale-95 shadow-sm"
                                            >
                                                {lang.addToCartBtn}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reviews List & Submission (1 col) */}
                <div className="space-y-6">
                    <div className="p-5 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm">
                        <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider mb-6">
                            <MessageSquare size={14} className="text-blue-500" />
                            {lang.reviewTitle}
                        </h3>

                        {/* Review Submission Form */}
                        <form onSubmit={handleReviewSubmit} className="space-y-4 mb-6 pb-6 border-b border-slate-100 dark:border-gray-850">
                            <div>
                                <label className="block text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 mb-2">
                                    Your Rating
                                </label>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRatingInput(star)}
                                            className="bg-transparent border-none cursor-pointer p-0 text-amber-400 hover:scale-110 transition-transform"
                                        >
                                            <Star 
                                                size={20} 
                                                fill={star <= ratingInput ? "currentColor" : "none"} 
                                                className={star <= ratingInput ? "text-amber-400" : "text-slate-300"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <textarea
                                    rows="3"
                                    placeholder={lang.reviewPlaceholder}
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-semibold text-slate-808 dark:text-white resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-bold text-xs rounded-xl border-none cursor-pointer transition shadow-md shadow-emerald-500/10"
                            >
                                {submittingReview ? "Submitting..." : lang.submitReview}
                            </button>
                        </form>

                        {/* Feedback List stream */}
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                            {supplier.reviews.length === 0 ? (
                                <p className="text-center text-xs text-slate-400 font-semibold py-4">{lang.reviewsEmpty}</p>
                            ) : (
                                supplier.reviews.map((rev, revIdx) => (
                                    <div key={revIdx} className="p-3 bg-slate-50 dark:bg-gray-950 border border-slate-200/10 dark:border-gray-850 rounded-2xl text-xs space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="font-extrabold text-slate-800 dark:text-slate-200">@{rev.username}</span>
                                            <div className="flex items-center gap-0.5 text-amber-500">
                                                <Star size={11} fill="currentColor" />
                                                <span className="font-black">{rev.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-slate-550 dark:text-slate-400 font-medium leading-relaxed">{rev.comment}</p>
                                        <p className="text-[9px] text-slate-400 dark:text-slate-550 font-semibold">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierDetail;
