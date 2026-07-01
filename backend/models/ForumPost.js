import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    photoUrl: { type: [String], default: [] },
    upvotes: { type: Number, default: 0 },
    upvotedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

const forumPostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        category: { 
            type: String, 
            enum: ['disease', 'pest', 'treatment', 'general'],
            required: true 
        },
        content: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        username: { type: String, required: true },
        cropType: { type: String, default: 'General' },
        location: { type: String, default: '' },
        photoUrl: { type: [String], default: [] },
        upvotes: { type: Number, default: 0 },
        upvotedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        replies: [replySchema],
        isPinned: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
export default ForumPost;
