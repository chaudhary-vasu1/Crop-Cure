import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { MessageCircle, ThumbsUp, Plus, Search, BookOpen, Trophy, Loader2, Pin } from 'lucide-react';
import NewPostModal from '../components/NewPostModal';

const CommunityForum = () => {
    const { language } = useContext(AppContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('recent');
    const [isNewPostOpen, setIsNewPostOpen] = useState(false);

    const t = {
        en: {
            title: "🤝 Community Forum",
            subtitle: "Discuss crop symptoms, pest control, and farming methods with other growers",
            btnAsk: "Ask a Question",
            searchPlaceholder: "Search discussions...",
            sortRecent: "Recent",
            sortPopular: "Popular",
            kbTitle: "Knowledge Base",
            kbBtn: "Open Guides",
            boardTitle: "Top Contributors",
            upvotes: "upvotes",
            replies: "replies",
            catAll: "All Topics",
            catDisease: "Diseases",
            catPest: "Pests",
            catTreatment: "Treatments",
            catGeneral: "General"
        },
        es: {
            title: "🤝 Foro Comunitario",
            subtitle: "Discuta síntomas de cultivos y control de plagas con otros agricultores",
            btnAsk: "Hacer una Pregunta",
            searchPlaceholder: "Buscar discusiones...",
            sortRecent: "Reciente",
            sortPopular: "Popular",
            kbTitle: "Base de Conocimiento",
            kbBtn: "Abrir Guías",
            boardTitle: "Colaboradores Destacados",
            upvotes: "votos",
            replies: "respuestas",
            catAll: "Todos",
            catDisease: "Enfermedades",
            catPest: "Plagas",
            catTreatment: "Tratamientos",
            catGeneral: "General"
        },
        hi: {
            title: "🤝 सामुदायिक मंच (Forum)",
            subtitle: "अन्य किसानों के साथ फसल के लक्षणों, कीट नियंत्रण और खेती के तरीकों पर चर्चा करें",
            btnAsk: "एक प्रश्न पूछें",
            searchPlaceholder: "चर्चा खोजें...",
            sortRecent: "हालिया (Recent)",
            sortPopular: "लोकप्रिय (Popular)",
            kbTitle: "ज्ञानकोष (Knowledge Base)",
            kbBtn: "मार्गदर्शिकाएँ खोलें",
            boardTitle: "शीर्ष योगदानकर्ता",
            upvotes: "वोट",
            replies: "जवाब",
            catAll: "सभी विषय",
            catDisease: "रोग",
            catPest: "कीट",
            catTreatment: "उपचार",
            catGeneral: "सामान्य"
        }
    };
    const lang = t[language] || t.en;

    const fetchData = async () => {
        setLoading(true);
        try {
            // Load filtered posts
            let endpoint = `/forum/posts`;
            const params = [];
            if (selectedCategory) params.push(`category=${selectedCategory}`);
            if (sortOption) params.push(`sort=${sortOption}`);
            if (searchQuery) params.push(`search=${searchQuery}`);
            if (params.length > 0) endpoint += `?${params.join('&')}`;

            const postsRes = await api.get(endpoint);
            setPosts(postsRes.data);

            // Load leaderboard
            const contributorsRes = await api.get('/forum/contributors');
            setContributors(contributorsRes.data);
        } catch (error) {
            console.error("Failed to load forum listings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedCategory, searchQuery, sortOption]);

    const handleUpvote = async (postId, e) => {
        e.stopPropagation(); // prevent navigating to detail
        try {
            const response = await api.post(`/forum/posts/${postId}/upvote`);
            // Update local state upvotes
            setPosts(prev => prev.map(p => p._id === postId ? response.data : p));
        } catch (err) {
            console.error("Failed to process upvote:", err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 text-left">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {lang.title}
                    </h2>
                    <p className="text-xs text-slate-450 dark:text-slate-550 font-semibold mt-1">
                        {lang.subtitle}
                    </p>
                </div>
                <button
                    onClick={() => setIsNewPostOpen(true)}
                    className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl flex items-center gap-1.5 border-none cursor-pointer transition shadow-md shadow-emerald-500/10 active:scale-95"
                >
                    <Plus size={14} />
                    {lang.btnAsk}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Posts Feed (3 cols) */}
                <div className="lg:col-span-3 space-y-5">
                    
                    {/* Filters & Sorting */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-white dark:bg-gray-900 border border-slate-200/40 dark:border-gray-800/60 rounded-3xl">
                        {/* Search Input */}
                        <div className="relative w-full sm:flex-1">
                            <Search className="absolute left-3.5 top-3 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder={lang.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200/60 dark:border-gray-800/80 rounded-xl outline-none text-xs font-semibold text-slate-808 dark:text-white"
                            />
                        </div>

                        {/* Sort Toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortOption('recent')}
                                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border cursor-pointer transition ${
                                    sortOption === 'recent'
                                        ? 'bg-slate-800 dark:bg-white text-white dark:text-black border-slate-800 dark:border-white shadow-sm'
                                        : 'bg-transparent text-slate-600 border-slate-200 dark:border-gray-800 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-gray-850'
                                }`}
                            >
                                {lang.sortRecent}
                            </button>
                            <button
                                onClick={() => setSortOption('popular')}
                                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border cursor-pointer transition ${
                                    sortOption === 'popular'
                                        ? 'bg-slate-800 dark:bg-white text-white dark:text-black border-slate-800 dark:border-white shadow-sm'
                                        : 'bg-transparent text-slate-600 border-slate-200 dark:border-gray-800 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-gray-850'
                                }`}
                            >
                                {lang.sortPopular}
                            </button>
                        </div>
                    </div>

                    {/* Topics category selector */}
                    <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                        {[
                            { value: '', label: lang.catAll },
                            { value: 'disease', label: lang.catDisease },
                            { value: 'pest', label: lang.catPest },
                            { value: 'treatment', label: lang.catTreatment },
                            { value: 'general', label: lang.catGeneral }
                        ].map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-full text-xs font-bold border-none cursor-pointer shrink-0 transition ${
                                    selectedCategory === cat.value
                                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/10'
                                        : 'bg-white dark:bg-gray-900 border border-slate-250/20 dark:border-gray-800/80 text-slate-650 dark:text-slate-350 hover:bg-slate-50'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-32 gap-3 text-slate-400">
                            <Loader2 size={32} className="animate-spin text-emerald-500" />
                            <p className="text-xs font-bold font-mono">Tuning threads frequencies...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="p-16 text-center text-xs font-bold text-slate-450 border border-dashed border-slate-200 dark:border-gray-800 rounded-3xl">
                            No forum topics found. Be the first to start a conversation!
                        </div>
                    ) : (
                        /* Feed thread posts list */
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div
                                    key={post._id}
                                    onClick={() => navigate(`/forum/post/${post._id}`)}
                                    className="p-5 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/55 rounded-3xl shadow-sm hover:shadow-md cursor-pointer transition duration-200 flex items-start gap-4"
                                >
                                    {/* Vote Sidebar */}
                                    <div className="flex flex-col items-center gap-1.5 bg-slate-50 dark:bg-gray-950 p-2.5 rounded-xl border border-slate-100 dark:border-gray-850 shrink-0">
                                        <button
                                            onClick={(e) => handleUpvote(post._id, e)}
                                            className="bg-transparent border-none p-0 cursor-pointer text-slate-400 hover:text-emerald-500 transition-colors"
                                        >
                                            <ThumbsUp size={14} className={post.upvotedUsers?.includes(localStorage.getItem('userId')) ? 'text-emerald-500 fill-emerald-500' : ''} />
                                        </button>
                                        <span className="text-[10px] font-black text-slate-800 dark:text-slate-200">{post.upvotes}</span>
                                    </div>

                                    {/* Content area */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2 text-[10px]">
                                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-350 font-black rounded uppercase tracking-wider">
                                                {post.category}
                                            </span>
                                            {post.cropType && (
                                                <span className="font-extrabold text-slate-450 dark:text-slate-500 capitalize">
                                                    🌾 {post.cropType}
                                                </span>
                                            )}
                                            {post.isPinned && (
                                                <span className="text-blue-500 font-extrabold flex items-center gap-0.5">
                                                    <Pin size={10} /> Pinned
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="text-xs font-black text-slate-850 dark:text-slate-100 leading-snug hover:text-emerald-500 transition-colors">
                                            {post.title}
                                        </h4>
                                        
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {post.content}
                                        </p>

                                        <div className="flex flex-wrap justify-between items-center pt-2.5 border-t border-slate-50 dark:border-gray-850/50 text-[10px] font-bold text-slate-400">
                                            <span>👤 @{post.username} {post.location && `• ${post.location}`}</span>
                                            <span className="flex items-center gap-1 text-slate-450 dark:text-slate-500">
                                                <MessageCircle size={12} /> {post.replies?.length} {lang.replies}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Side Leaderboard & KB promo (1 col) */}
                <div className="space-y-6">
                    {/* Knowledge Base Promo */}
                    <div className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl shadow-sm text-left">
                        <BookOpen size={24} className="opacity-90 mb-3" />
                        <h4 className="text-sm font-black text-white">{lang.kbTitle}</h4>
                        <p className="text-[10px] opacity-90 mt-1.5 leading-relaxed font-medium">
                            Read detailed crop diagnostics manuals and disease treatment schedules written by expert agronomists.
                        </p>
                        <button
                            onClick={() => navigate('/knowledge-base')}
                            className="mt-4 w-full py-2 bg-white hover:bg-slate-50 text-emerald-600 font-black text-xs rounded-xl border-none cursor-pointer transition shadow-sm"
                        >
                            {lang.kbBtn}
                        </button>
                    </div>

                    {/* Contributor Leaderboard */}
                    <div className="p-5 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm">
                        <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider mb-5">
                            <Trophy size={14} className="text-amber-500 animate-pulse" />
                            {lang.boardTitle}
                        </h3>

                        <div className="space-y-3">
                            {contributors.map((contrib, cIdx) => (
                                <div key={cIdx} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-gray-955 rounded-xl border border-slate-150/10 dark:border-gray-850">
                                    <div className="text-left">
                                        <p className="text-xs font-extrabold text-slate-800 dark:text-slate-250">@{contrib.username}</p>
                                        <span className="text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-450 tracking-wider">
                                            {contrib.badge}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-450 dark:text-slate-500">
                                        {contrib.points} pts
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for asking a question */}
            <NewPostModal 
                isOpen={isNewPostOpen} 
                onClose={() => {
                    setIsNewPostOpen(false);
                    fetchData();
                }} 
            />
        </div>
    );
};

export default CommunityForum;
