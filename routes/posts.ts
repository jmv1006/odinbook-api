import express from "express";
const router = express.Router();
import { get_all_posts, create_post } from '../controllers/posts_controller';

router.get('/all', get_all_posts);

router.post('/:UserId', create_post);

export default router;