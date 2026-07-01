import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { ArrowLeft, ThumbsUp, MessageSquare, Plus, Loader2 } from 'lucide-react';

const PostDetail = () => {
    const { postId } = useParams();
    const { language } = useContext(AppContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [replyInput, setReplyInput] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    const t = {
        en: {
            back: "Back to Forum",
            repliesTitle: "Discussion Replies",
            replyPlaceholder: "Write a reply, suggest treatment, or share similar observations...",
            btnReply: "Post Reply",
            upvotes: "upvotes",
            replies: "replies",
            emptyReplies: "No replies yet. Be the first to share your thoughts!"
        },
        es: {
            back: "Volver al Foro",
            repliesTitle: "Respuestas de la Discusión",
            replyPlaceholder: "Escriba una respuesta, sugiera un tratamiento...",
            btnReply: "Publicar Respuesta",
            upvotes: "votos",
            replies: "respuestas",
            emptyReplies: "Aún no hay respuestas. ¡Comparte tus pensamientos!"
        },
        hi: {
            back: "फोरम पर वापस जाएं",
            repliesTitle: "चर्चा के जवाब",
            replyPlaceholder: "एक उत्तर लिखें, उपचार का सुझाव दें, या समान अवलोकन साझा करें...",
            btnReply: "जवाब पोस्ट करें",
            upvotes: "वोट",
            replies: "जवाब",
            emptyReplies: "अभी तक कोई जवाब नहीं। अपने विचार साझा करने वाले पहले बनें!"
        }
    };
    const lang = t[language] || t.en;

    const fetchPost = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/forum/posts/${postId}`);
            setPost(response.data);
        } catch (error) {
            console.error("Failed to load post details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const handlePostUpvote = async () => {
        try {
            const response = await api.post(`/forum/posts/${postId}/upvote`);
            setPost(response.data);
        } catch (err) {
            console.error("Upvote failed:", err);
        }
    };

    const handleReplyUpvote = async (replyId) => {
        try {
            const response = await api.post(`/forum/posts/${postId}/upvote`, { replyId });
            setPost(response.data);
        } catch (err) {
            console.error("Reply upvote failed:", err);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyInput) return;
        setSubmittingReply(true);
        try {
            const response = await api.post(`/forum/posts/${postId}/reply`, {
                content: replyInput
            });
            setPost(response.data);
            setReplyInput('');
        } catch (err) {
            console.error("Failed to post reply:", err);
        } finally {
            setSubmittingReply(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-32 gap-3 text-slate-400">
                <Loader2 size={32} className="animate-spin text-emerald-500" />
                <p className="text-xs font-bold">Unfolding discussion thread...</p>
            </div>
        );
    }

    if (!post) return null;

    const userId = localStorage.getItem('userId');

    return (
        <div className="container mx-auto px-4 py-8 text-left max-w-3xl">
            <button 
                onClick={() => navigate('/forum')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-550 dark:text-slate-400 bg-transparent border-none p-0 cursor-pointer hover:text-emerald-500 mb-6 transition"
            >
                <ArrowLeft size={14} /> {lang.back}
            </button>

            {/* Original Post Main Card */}
            <div className="p-6 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/55 rounded-3xl shadow-sm space-y-4">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px]">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-gray-800 text-slate-650 dark:text-slate-350 font-black rounded uppercase tracking-wider">
                                {post.category}
                            </span>
                            {post.cropType && (
                                <span className="font-extrabold text-slate-450 dark:text-slate-500 capitalize">
                                    🌾 {post.cropType}
                                </span>
                            )}
                        </div>
                        <h2 className="text-base md:text-lg font-black text-slate-805 dark:text-slate-105 leading-snug">
                            {post.title}
                        </h2>
                    </div>

                    {/* Upvote Post Button */}
                    <button
                        onClick={handlePostUpvote}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-gray-800 text-xs font-bold cursor-pointer transition ${
                            post.upvotedUsers?.includes(userId)
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-slate-50 hover:bg-slate-100 dark:bg-gray-950 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-200'
                        }`}
                    >
                        <ThumbsUp size={12} fill={post.upvotedUsers?.includes(userId) ? "currentColor" : "none"} />
                        <span>{post.upvotes}</span>
                    </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                    {post.content}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-gray-850/50 text-[10px] font-bold text-slate-450 flex items-center justify-between">
                    <span>Posted by @{post.username} {post.location && `• ${post.location}`}</span>
                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                </div>
            </div>

            {/* Replies section */}
            <div className="mt-8 space-y-6">
                <h3 className="text-xs font-black text-slate-500 dark:text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare size={13} />
                    {lang.repliesTitle} ({post.replies?.length})
                </h3>

                {/* Reply Form */}
                <form onSubmit={handleReplySubmit} className="bg-white dark:bg-gray-900 border border-slate-200/40 dark:border-gray-800/60 rounded-3xl p-5 space-y-4">
                    <textarea
                        rows="3"
                        placeholder={lang.replyPlaceholder}
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs font-semibold text-slate-808 dark:text-white resize-none"
                        required
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submittingReply}
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-extrabold text-xs rounded-xl border-none cursor-pointer transition flex items-center gap-1"
                        >
                            <Plus size={14} />
                            {submittingReply ? "Posting..." : lang.btnReply}
                        </button>
                    </div>
                </form>

                {/* Replies list */}
                <div className="space-y-4">
                    {post.replies.length === 0 ? (
                        <div className="p-8 text-center text-xs font-semibold text-slate-400 border border-dashed border-slate-200 dark:border-gray-800 rounded-2xl">
                            {lang.emptyReplies}
                        </div>
                    ) : (
                        post.replies.map((rep) => (
                            <div key={rep._id} className="p-5 bg-white dark:bg-gray-900 border border-slate-200/45 dark:border-gray-808/50 rounded-3xl text-xs space-y-3 flex items-start gap-4">
                                
                                {/* Upvote Reply */}
                                <div className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-gray-950 p-2 rounded-lg border border-slate-100 dark:border-gray-850 shrink-0">
                                    <button
                                        onClick={() => handleReplyUpvote(rep._id)}
                                        className="bg-transparent border-none p-0 cursor-pointer text-slate-400 hover:text-emerald-500 transition-colors"
                                    >
                                        <ThumbsUp size={11} className={rep.upvotedUsers?.includes(userId) ? 'text-emerald-500 fill-emerald-500' : ''} />
                                    </button>
                                    <span className="text-[9px] font-black text-slate-805 dark:text-slate-250">{rep.upvotes}</span>
                                </div>

                                <div className="flex-1 space-y-1.5">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                                        <span className="text-slate-700 dark:text-slate-300 font-extrabold">@{rep.username}</span>
                                        <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                                        {rep.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
