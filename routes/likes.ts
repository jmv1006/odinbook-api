import express from "express";
const router = express.Router();
import { toggle_post_like, get_post_likes } from '../controllers/likes_controller';
import checkUserExists from '../middleware/auth/check_user_exists';
import checkPostExists from '../middleware/auth/check_post_exists';

router.get('/post/:PostId', checkPostExists, get_post_likes)

router.post('/post/:PostId/:UserId', checkUserExists, checkPostExists, toggle_post_like);

export default router;