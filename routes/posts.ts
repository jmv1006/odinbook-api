import express from "express";
const router = express.Router();
import { get_all_posts, create_post, get_timeline_posts } from '../controllers/posts_controller';
import checkUserExists from '../middleware/check_user_exists';

router.get('/all', get_all_posts);

router.post('/:UserId', checkUserExists, create_post);

router.post('/:UserId/timeline', checkUserExists, get_timeline_posts)

export default router;