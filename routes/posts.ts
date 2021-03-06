import express from "express";
const router = express.Router();
import { get_all_posts, create_post, get_timeline_posts, get_user_posts } from '../controllers/posts_controller';
import checkUserExists from '../middleware/auth/check_user_exists';

router.get('/all', get_all_posts);

router.post('/:UserId', checkUserExists, create_post);

router.get('/:UserId', checkUserExists, get_user_posts)

router.get('/:UserId/timeline', checkUserExists, get_timeline_posts);

export default router;