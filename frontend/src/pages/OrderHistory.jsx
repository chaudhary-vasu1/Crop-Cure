import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { ArrowLeft, Box, Loader2 } from 'lucide-react';

const OrderHistory = () => {
    const { language } = useContext(AppContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    const t = {
        en: {
            title: "📦 Order History",
            subtitle: "Track status of agricultural seed, fertilizer and tool delivery orders",
            empty: "No orders placed yet.",
            btnShop: "Browse Marketplace",
            orderId: "Order ID:",
            statusPending: "Pending Shipping",
            statusDelivered: "Delivered",
            deliveryTo: "Delivering to:",
            qty: "Quantity:",
            total: "Total:"
        },
        es: {
            title: "📦 Historial de Pedidos",
            subtitle: "Seguimiento de pedidos de entrega de insumos agrícolas",
            empty: "Aún no se han realizado pedidos.",
            btnShop: "Explorar Mercado",
            orderId: "ID de Pedido:",
            statusPending: "Envío Pendiente",
            statusDelivered: "Entregado",
            deliveryTo: "Entregar en:",
            qty: "Cantidad:",
            total: "Total:"
        },
        hi: {
            title: "📦 आर्डर इतिहास (Order History)",
            subtitle: "बीज, खाद और कृषि उपकरणों के वितरण आर्डर की स्थिति ट्रैक करें",
            empty: "अभी तक कोई आर्डर नहीं दिया गया।",
            btnShop: "बाजार देखें",
            orderId: "ऑर्डर आईडी:",
            statusPending: "शिपिंग लंबित है",
            statusDelivered: "वितरित (Delivered)",
            deliveryTo: "डिलिवरी पता:",
            qty: "मात्रा (Qty):",
            total: "कुल मूल्य:"
        }
    };
    const lang = t[language] || t.en;

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to load order logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 text-left">
            <button 
                onClick={() => navigate('/marketplace')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-550 dark:text-slate-400 bg-transparent border-none cursor-pointer hover:text-emerald-500 mb-6 transition"
            >
                <ArrowLeft size={14} /> Back to Marketplace
            </button>

            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {lang.title}
            </h2>
            <p className="text-xs text-slate-450 dark:text-slate-550 font-semibold mt-1 mb-8">
                {lang.subtitle}
            </p>

            {loading ? (
                <div className="flex flex-col justify-center items-center py-32 gap-3 text-slate-400">
                    <Loader2 size={32} className="animate-spin text-emerald-500" />
                    <p className="text-xs font-bold">Loading order history logs...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 border border-slate-200/40 dark:border-gray-800/60 rounded-3xl p-8 flex flex-col items-center gap-4">
                    <Box size={44} className="text-slate-350 dark:text-slate-650" />
                    <p className="text-xs font-bold text-slate-450 dark:text-slate-500">{lang.empty}</p>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl border-none cursor-pointer transition shadow-md"
                    >
                        {lang.btnShop}
                    </button>
                </div>
            ) : (
                <div className="space-y-4 max-w-2xl">
                    {orders.map((order) => (
                        <div key={order._id} className="p-5 bg-white dark:bg-gray-900 border border-slate-200/40 dark:border-gray-800/50 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-slate-800 dark:text-slate-100 capitalize">
                                        {order.productId?.name || 'Agri Product'}
                                    </span>
                                    <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${
                                        order.status === 'pending'
                                            ? 'bg-yellow-50 text-yellow-750 dark:bg-yellow-950/20 dark:text-yellow-450'
                                            : 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                                    }`}>
                                        {order.status === 'pending' ? lang.statusPending : lang.statusDelivered}
                                    </span>
                                </div>

                                <div className="space-y-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                                    <p>{lang.orderId} #{order._id}</p>
                                    <p>{lang.qty} {order.quantity} • Total price: ₹{order.totalPrice}</p>
                                    <p>{lang.deliveryTo} <span className="font-bold text-slate-700 dark:text-slate-350">{order.deliveryLocation}</span></p>
                                </div>
                            </div>
                            
                            <div className="text-right text-[10px] text-slate-400 font-bold shrink-0 self-end sm:self-auto">
                                {new Date(order.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
