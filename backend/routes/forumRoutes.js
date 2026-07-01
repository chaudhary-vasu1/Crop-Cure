import express from 'express';
import { 
    createPost, 
    getPosts, 
    getPostById, 
    addReply, 
    upvotePostOrReply, 
    getKnowledgeBaseArticle, 
    getTopContributors 
} from '../controllers/forumController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protection
router.use(protect);

router.route('/posts')
    .post(createPost)
    .get(getPosts);

router.route('/posts/:postId')
    .get(getPostById);

router.route('/posts/:postId/reply')
    .post(addReply);

router.route('/posts/:postId/upvote')
    .post(upvotePostOrReply);

router.route('/contributors')
    .get(getTopContributors);

router.route('/knowledge-base/:topic')
    .get(getKnowledgeBaseArticle);

export default router;
