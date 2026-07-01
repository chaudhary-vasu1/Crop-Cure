import ForumPost from '../models/ForumPost.js';
import User from '../models/User.js';

// @desc    Create new post
// @route   POST /api/forum/posts
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { title, category, content, cropType, location, photoUrl } = req.body;
        if (!title || !category || !content) {
            return res.status(400).json({ message: 'Title, category, and content are required.' });
        }

        const user = await User.findById(req.user.id || req.user._id);

        const post = await ForumPost.create({
            title,
            category,
            content,
            cropType: cropType || 'General',
            location: location || '',
            photoUrl: photoUrl || [],
            userId: user._id,
            username: user.username,
            upvotes: 0,
            replies: [],
            isPinned: false
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
};

// @desc    Get posts with filtering (category, search, sort)
// @route   GET /api/forum/posts
// @access  Private
export const getPosts = async (req, res) => {
    try {
        const { category, sort, search } = req.query;
        
        const query = {};
        if (category) {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { cropType: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'popular') {
            sortOption = { upvotes: -1, createdAt: -1 };
        }

        const posts = await ForumPost.find(query)
            .sort(sortOption);

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
    }
};

// @desc    Get single post details
// @route   GET /api/forum/posts/:postId
// @access  Private
export const getPostById = async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch post details', error: error.message });
    }
};

// @desc    Add reply to post
// @route   POST /api/forum/posts/:postId/reply
// @access  Private
export const addReply = async (req, res) => {
    try {
        const { content, photoUrl } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Reply content is required.' });
        }

        const post = await ForumPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const user = await User.findById(req.user.id || req.user._id);

        const newReply = {
            content,
            userId: user._id,
            username: user.username,
            photoUrl: photoUrl || [],
            upvotes: 0,
            createdAt: new Date()
        };

        post.replies.push(newReply);
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add reply', error: error.message });
    }
};

// @desc    Upvote post or reply
// @route   POST /api/forum/posts/:postId/upvote
// @access  Private
export const upvotePostOrReply = async (req, res) => {
    try {
        const { postId } = req.params;
        const { replyId } = req.body;
        const userId = req.user.id || req.user._id;

        const post = await ForumPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        if (replyId) {
            // Upvote a specific reply
            const reply = post.replies.id(replyId);
            if (!reply) {
                return res.status(404).json({ message: 'Reply not found.' });
            }

            const upvotedIndex = reply.upvotedUsers.indexOf(userId);
            if (upvotedIndex > -1) {
                // Undo upvote
                reply.upvotedUsers.splice(upvotedIndex, 1);
                reply.upvotes = Math.max(0, reply.upvotes - 1);
            } else {
                // Add upvote
                reply.upvotedUsers.push(userId);
                reply.upvotes += 1;
            }
        } else {
            // Upvote the post
            const upvotedIndex = post.upvotedUsers.indexOf(userId);
            if (upvotedIndex > -1) {
                // Undo upvote
                post.upvotedUsers.splice(upvotedIndex, 1);
                post.upvotes = Math.max(0, post.upvotes - 1);
            } else {
                // Add upvote
                post.upvotedUsers.push(userId);
                post.upvotes += 1;
            }
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to process upvote', error: error.message });
    }
};

// @desc    Get knowledge-base topic articles
// @route   GET /api/knowledge-base/:topic
// @access  Private
export const getKnowledgeBaseArticle = async (req, res) => {
    try {
        const { topic } = req.params;
        
        const knowledgeBase = {
            wheat: {
                title: 'Wheat Cultivation and Disease Management Guide',
                content: 'Wheat is a key cereal crop. Common concerns include Leaf Rust (Puccinia recondita) and Loose Smut. Optimal temperature ranges between 15-25°C. Water critical stages: Tillering, flowering, grain development.',
                organicRemedies: 'Neem seed kernel extract sprays; seed treatment with Trichoderma viride.',
                chemicalRemedies: 'Tebuconazole 2% DS seed dressing; Propiconazole 25% EC foliage sprays.'
            },
            rice: {
                title: 'Rice/Paddy Crop Optimization Guide',
                content: 'Rice blast (Magnaporthe oryzae) and Bacterial Leaf Blight are highly contagious. Ensure fields undergo AWD (Alternate Wetting and Drying) to prevent stagnation that hosts pathogens.',
                organicRemedies: 'Spray Pseudomonas fluorescens formulations; incorporate ash in nursery beds.',
                chemicalRemedies: 'Tricyclazole 75% WP for rice blast; Streptocycline spray for Bacterial Blight.'
            },
            sugarcane: {
                title: 'Sugarcane Crop Protection Manual',
                content: 'Red rot (Colletotrichum falcatum) causes massive crop failure. Identified by red discoloration with white cross bands on splitting the stem. Crop rotation is highly recommended.',
                organicRemedies: 'Use virus-free tissue culture plantlets; seed treatment with hot water.',
                chemicalRemedies: 'Setts treatment in Carbendazim 0.1% solution prior to sowing.'
            },
            general: {
                title: 'General Crop Health Management',
                content: 'Successful farm management relies on crop rotations, balanced soil chemistry, maintaining spacing, and avoiding damp/stagnant field pools.',
                organicRemedies: 'Neem oil sprays, compost teas, green manures.',
                chemicalRemedies: 'Consult localized government extension services before chemical application.'
            }
        };

        const article = knowledgeBase[topic.toLowerCase()] || knowledgeBase.general;
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch knowledge base article', error: error.message });
    }
};

// @desc    Get contributor leaderboard
// @route   GET /api/forum/contributors
// @access  Private
export const getTopContributors = async (req, res) => {
    try {
        const contributors = [
            { username: 'FarmerRamesh', points: 340, badge: 'Pest Expert' },
            { username: 'GreenFingersRaj', points: 280, badge: 'Organic Guru' },
            { username: 'Vikas_Patil', points: 190, badge: 'Rice Veteran' },
            { username: 'Ankita_K', points: 150, badge: 'Soil Doctor' }
        ];
        res.status(200).json(contributors);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load contributors', error: error.message });
    }
};
