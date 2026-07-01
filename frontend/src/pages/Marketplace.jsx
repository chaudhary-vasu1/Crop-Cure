import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { ShoppingCart, Search, Filter, ShieldCheck, Tag, Loader2, ListOrdered, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
    const { addToCart, cart, language } = useContext(AppContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    
    // Price Comparison States
    const [compareQuery, setCompareQuery] = useState('');
    const [compareResults, setCompareResults] = useState([]);
    const [comparing, setComparing] = useState(false);

    const t = {
        en: {
            title: "🚜 Agri-Marketplace",
            subtitle: "Purchase certified seeds, organic pesticides, and crop supplements from verified suppliers",
            searchPlaceholder: "Search products (e.g., seeds, neem spray)...",
            compareTitle: "⚡ Fast Price Comparison",
            comparePlaceholder: "Enter crop product name (e.g. NPK, wheat)",
            compareBtn: "Compare Prices",
            cheapestLabel: "Lowest Price First",
            addToCartBtn: "Add To Cart",
            btnCart: "View Cart",
            btnOrders: "My Orders",
            categoryAll: "All Products",
            categorySeeds: "Seeds",
            categoryPesticides: "Pesticides",
            categoryFertilizers: "Fertilizers",
            verifiedSupplier: "Verified Supplier"
        },
        es: {
            title: "🚜 Mercado Agrícola",
            subtitle: "Compre semillas certificadas, pesticidas orgánicos y fertilizantes de proveedores verificados",
            searchPlaceholder: "Buscar productos (ej. semillas, neem spray)...",
            compareTitle: "⚡ Comparador Rápido de Precios",
            comparePlaceholder: "Ej. NPK, trigo",
            compareBtn: "Comparar Precios",
            cheapestLabel: "Precio más bajo primero",
            addToCartBtn: "Añadir al Carrito",
            btnCart: "Ver Carrito",
            btnOrders: "Mis Pedidos",
            categoryAll: "Todos",
            categorySeeds: "Semillas",
            categoryPesticides: "Pesticidas",
            categoryFertilizers: "Fertilizantes",
            verifiedSupplier: "Proveedor Verificado"
        },
        hi: {
            title: "🚜 कृषि बाजार (Marketplace)",
            subtitle: "सत्यापित आपूर्तिकर्ताओं से प्रमाणित बीज, जैविक कीटनाशक और उर्वरक खरीदें",
            searchPlaceholder: "उत्पाद खोजें (जैसे बीज, नीम का स्प्रे)...",
            compareTitle: "⚡ त्वरित मूल्य तुलना (Price Compare)",
            comparePlaceholder: "उत्पाद का नाम दर्ज करें (जैसे NPK, गेहूं)",
            compareBtn: "कीमतों की तुलना करें",
            cheapestLabel: "सबसे कम कीमत पहले",
            addToCartBtn: "कार्ट में जोड़ें",
            btnCart: "कार्ट देखें",
            btnOrders: "मेरे आर्डर",
            categoryAll: "सभी उत्पाद",
            categorySeeds: "बीज",
            categoryPesticides: "कीटनाशक",
            categoryFertilizers: "उर्वरक",
            verifiedSupplier: "सत्यापित विक्रेता"
        }
    };
    const lang = t[language] || t.en;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let endpoint = '/marketplace/products';
            const params = [];
            if (selectedCategory) params.push(`category=${selectedCategory}`);
            if (searchQuery) params.push(`search=${searchQuery}`);
            if (params.length > 0) endpoint += `?${params.join('&')}`;

            const response = await api.get(endpoint);
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, searchQuery]);

    const handleCompareSubmit = async (e) => {
        e.preventDefault();
        if (!compareQuery) return;
        setComparing(true);
        try {
            const response = await api.get(`/marketplace/price-comparison?search=${compareQuery}`);
            setCompareResults(response.data);
        } catch (err) {
            console.error("Price comparison failed:", err);
        } finally {
            setComparing(false);
        }
    };

    const cartTotalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

    return (
        <div className="container mx-auto px-4 py-8 text-left">
            
            {/* Header section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {lang.title}
                    </h2>
                    <p className="text-xs text-slate-450 dark:text-slate-550 font-semibold mt-1">
                        {lang.subtitle}
                    </p>
                </div>
                
                {/* Cart and Orders Links */}
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button
                        onClick={() => navigate('/marketplace/orders')}
                        className="flex-1 lg:flex-none py-2.5 px-4 bg-slate-105 hover:bg-slate-200/60 dark:bg-gray-900 dark:hover:bg-gray-805 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-gray-800 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer transition"
                    >
                        <ListOrdered size={14} />
                        {lang.btnOrders}
                    </button>
                    <button
                        onClick={() => navigate('/marketplace/cart')}
                        className="flex-1 lg:flex-none py-2.5 px-5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 border-none cursor-pointer transition shadow-md shadow-emerald-500/10 active:scale-95"
                    >
                        <ShoppingCart size={14} />
                        <span>{lang.btnCart} ({cartTotalItems})</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Main Product Shelf (3 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Search & Categories Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-gray-900 p-4 border border-slate-200/40 dark:border-gray-800/60 rounded-3xl">
                        <div className="relative w-full sm:flex-1">
                            <Search className="absolute left-3.5 top-3 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder={lang.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200/60 dark:border-gray-800/80 rounded-xl outline-none text-xs font-semibold text-slate-800 dark:text-white"
                            />
                        </div>

                        {/* Category Dropdown/Selector */}
                        <div className="flex gap-2 w-full sm:w-auto">
                            {['', 'seed', 'fertilizer', 'pesticide'].map((cat) => {
                                const catLabel = cat === '' ? lang.categoryAll : cat === 'seed' ? lang.categorySeeds : cat === 'fertilizer' ? lang.categoryFertilizers : lang.categoryPesticides;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border-none cursor-pointer transition-all ${
                                            selectedCategory === cat
                                                ? 'bg-slate-800 dark:bg-white text-white dark:text-black shadow-sm'
                                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-slate-650 dark:text-slate-300'
                                        }`}
                                    >
                                        {catLabel}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-32 gap-3 text-slate-400">
                            <Loader2 size={32} className="animate-spin text-emerald-500" />
                            <p className="text-xs font-bold">Stocking marketplace shelf...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-16 text-center text-xs font-bold text-slate-400 border border-dashed border-slate-200 dark:border-gray-800 rounded-3xl">
                            No products found matching your active filters.
                        </div>
                    ) : (
                        /* Products Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product._id} className="flex flex-col bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/55 rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition duration-300">
                                    {/* Product image */}
                                    <div className="h-44 bg-slate-50 dark:bg-gray-950 overflow-hidden relative">
                                        {product.image ? (
                                            <img 
                                                src={product.image} 
                                                alt={product.name} 
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl opacity-60">🌾</div>
                                        )}
                                        <span className="absolute top-3.5 left-3.5 px-2.5 py-0.5 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm text-white text-[9px] font-black uppercase rounded-full tracking-wider">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Details */}
                                    <div className="p-5 flex-1 flex flex-col justify-between text-left">
                                        <div>
                                            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 leading-snug">
                                                {product.name}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                                {product.description}
                                            </p>

                                            {/* Supplier Link details */}
                                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-850 flex items-center justify-between text-[10px] font-bold">
                                                <button
                                                    onClick={() => navigate(`/marketplace/supplier/${product.supplierId?._id}`)}
                                                    className="bg-transparent border-none p-0 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-emerald-500 font-extrabold flex items-center gap-1"
                                                >
                                                    👤 {product.supplierId?.name || 'Local Seller'}
                                                </button>
                                                
                                                {product.supplierId?.verified && (
                                                    <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-450 text-[9px]">
                                                        <ShieldCheck size={11} /> {lang.verifiedSupplier}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-50 dark:border-gray-850">
                                            <div>
                                                <span className="text-[9px] uppercase tracking-wider font-black text-slate-400 dark:text-slate-550 block">Price</span>
                                                <span className="text-base font-black text-slate-800 dark:text-white">₹{product.price}</span>
                                            </div>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl border-none cursor-pointer transition active:scale-95 shadow-sm shadow-emerald-500/10"
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

                {/* Right Column: Price Comparison & Supplier Search (1 col) */}
                <div className="space-y-6 text-left">
                    
                    {/* Price Comparison Widget */}
                    <div className="p-5 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm">
                        <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                            <Tag size={14} className="text-blue-500" />
                            {lang.compareTitle}
                        </h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mb-4 leading-relaxed">
                            Find the absolute lowest price across registered vendors.
                        </p>

                        <form onSubmit={handleCompareSubmit} className="space-y-3">
                            <input
                                type="text"
                                placeholder={lang.comparePlaceholder}
                                value={compareQuery}
                                onChange={(e) => setCompareQuery(e.target.value)}
                                className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200/60 dark:border-gray-800/80 rounded-xl outline-none text-xs font-semibold text-slate-808 dark:text-white"
                                required
                            />
                            <button
                                type="submit"
                                disabled={comparing}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-xs rounded-xl border-none cursor-pointer transition"
                            >
                                {comparing ? "Comparing..." : lang.compareBtn}
                            </button>
                        </form>

                        {compareResults.length > 0 && (
                            <div className="mt-5 space-y-3 border-t border-slate-100 dark:border-gray-850 pt-4">
                                <p className="text-[9px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                                    💰 {lang.cheapestLabel}
                                </p>
                                <div className="space-y-2">
                                    {compareResults.map((p, pIdx) => (
                                        <div key={pIdx} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-gray-950 rounded-xl text-[11px] font-semibold border border-slate-100 dark:border-gray-850">
                                            <div>
                                                <p className="font-extrabold text-slate-800 dark:text-slate-205 truncate max-w-[120px]">{p.name}</p>
                                                <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate max-w-[120px]">By {p.supplierId?.name}</p>
                                            </div>
                                            <span className="font-black text-emerald-600 dark:text-emerald-450 text-xs">₹{p.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
