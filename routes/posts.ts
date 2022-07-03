import express from "express";
const router = express.Router();
import { get_all_posts, create_post, get_timeline_posts } from '../controllers/posts_controller';

router.get('/all', get_all_posts);

router.post('/:UserId', create_post);

router.post('/:UserId/timeline', get_timeline_posts)

export default router;