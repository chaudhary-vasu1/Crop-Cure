import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { ArrowLeft, ShoppingBag, Trash2, MapPin, Loader2, CheckCircle } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, clearCart, language } = useContext(AppContext);
    const navigate = useNavigate();

    const [deliveryLocation, setDeliveryLocation] = useState('');
    const [checkingOut, setCheckingOut] = useState(false);
    const [success, setSuccess] = useState(false);

    const t = {
        en: {
            title: "🛒 Shopping Cart",
            empty: "Your cart is empty.",
            btnShop: "Go to Marketplace",
            summary: "Order Summary",
            subtotal: "Subtotal",
            shipping: "Shipping",
            free: "FREE",
            total: "Total Price",
            deliveryLabel: "Delivery Address",
            deliveryPlaceholder: "Enter full address with PIN code...",
            btnCheckout: "Place Order (Mock Cash on Delivery)",
            removing: "Removing...",
            successMsg: "Orders placed successfully!"
        },
        es: {
            title: "🛒 Carrito de Compras",
            empty: "Su carrito está vacío.",
            btnShop: "Ir al Mercado",
            summary: "Resumen del Pedido",
            subtotal: "Subtotal",
            shipping: "Envío",
            free: "GRATIS",
            total: "Total",
            deliveryLabel: "Dirección de Entrega",
            deliveryPlaceholder: "Ingrese dirección completa...",
            btnCheckout: "Realizar Pedido",
            removing: "Eliminando...",
            successMsg: "¡Pedido realizado con éxito!"
        },
        hi: {
            title: "🛒 शॉपिंग कार्ट",
            empty: "आपका कार्ट खाली है।",
            btnShop: "बाजार में जाएं",
            summary: "आर्डर सारांश",
            subtotal: "उप-योग",
            shipping: "शिपिंग शुल्क",
            free: "निःशुल्क",
            total: "कुल मूल्य",
            deliveryLabel: "डिलिवरी का पता",
            deliveryPlaceholder: "पिन कोड सहित पूरा पता लिखें...",
            btnCheckout: "ऑर्डर सबमिट करें (कैश ऑन डिलीवरी)",
            removing: "हटाया जा रहा है...",
            successMsg: "ऑर्डर सफलतापूर्वक सबमिट हो गया!"
        }
    };
    const lang = t[language] || t.en;

    const subtotalPrice = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;
        if (!deliveryLocation) {
            alert("Please enter a delivery location.");
            return;
        }

        setCheckingOut(true);
        try {
            // Place orders sequentially for each product in the cart
            for (const item of cart) {
                await api.post('/orders', {
                    productId: item.product._id,
                    quantity: item.quantity,
                    deliveryLocation
                });
            }
            
            setSuccess(true);
            clearCart();
            setTimeout(() => {
                navigate('/marketplace/orders');
            }, 1500);
        } catch (err) {
            console.error("Order checkout failed:", err);
            alert(err.response?.data?.message || "Failed to complete checkout.");
        } finally {
            setCheckingOut(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col justify-center items-center py-32 gap-4 text-center">
                <CheckCircle size={56} className="text-emerald-500 animate-bounce" />
                <h3 className="text-lg font-black text-slate-805 dark:text-white">{lang.successMsg}</h3>
                <p className="text-xs text-slate-400">Navigating to your order logs...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 text-left">
            <button 
                onClick={() => navigate('/marketplace')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-550 dark:text-slate-400 bg-transparent border-none cursor-pointer hover:text-emerald-500 mb-6 transition"
            >
                <ArrowLeft size={14} /> Back to Marketplace
            </button>

            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-8">
                {lang.title}
            </h2>

            {cart.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 border border-slate-200/40 dark:border-gray-800/60 rounded-3xl p-8 flex flex-col items-center gap-4">
                    <ShoppingBag size={48} className="text-slate-300 dark:text-slate-700" />
                    <p className="text-sm font-bold text-slate-450 dark:text-slate-500">{lang.empty}</p>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="px-6 py-2.5 bg-emerald-555 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl border-none cursor-pointer transition shadow-md"
                    >
                        {lang.btnShop}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Item list (2 cols) */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.product._id} className="p-4 bg-white dark:bg-gray-900 border border-slate-200/40 dark:border-gray-800/50 rounded-2xl flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-slate-50 dark:bg-gray-950 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-xl">
                                        {item.product.image ? (
                                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            "🌱"
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight line-clamp-1">{item.product.name}</h4>
                                        <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 font-bold">
                                            Qty: {item.quantity} × ₹{item.product.price}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-slate-800 dark:text-white">₹{item.product.price * item.quantity}</span>
                                    <button
                                        onClick={() => removeFromCart(item.product._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl bg-transparent border-none cursor-pointer transition"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary & Checkout Address (1 col) */}
                    <div className="space-y-6">
                        <div className="p-5 bg-white dark:bg-gray-900 border border-slate-200/40 dark:border-gray-800/50 rounded-3xl shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">
                                {lang.summary}
                            </h3>
                            
                            <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                <div className="flex justify-between">
                                    <span>{lang.subtotal}</span>
                                    <span className="font-extrabold text-slate-805 dark:text-slate-200">₹{subtotalPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{lang.shipping}</span>
                                    <span className="font-extrabold text-emerald-500">{lang.free}</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 dark:border-gray-850 pt-3 flex justify-between items-center text-xs">
                                <span className="font-black text-slate-800 dark:text-slate-250">{lang.total}</span>
                                <span className="text-base font-black text-emerald-600 dark:text-emerald-450">₹{subtotalPrice}</span>
                            </div>

                            {/* Address form */}
                            <form onSubmit={handleCheckout} className="space-y-4 pt-3 border-t border-slate-100 dark:border-gray-850">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-450 dark:text-slate-500 mb-2 flex items-center gap-1">
                                        <MapPin size={11} className="text-blue-500" />
                                        {lang.deliveryLabel}
                                    </label>
                                    <textarea
                                        rows="3"
                                        placeholder={lang.deliveryPlaceholder}
                                        value={deliveryLocation}
                                        onChange={(e) => setDeliveryLocation(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-semibold text-slate-808 dark:text-white resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={checkingOut}
                                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-extrabold text-xs rounded-xl border-none cursor-pointer transition shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                                >
                                    {checkingOut ? <Loader2 size={13} className="animate-spin" /> : lang.btnCheckout}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
