import express from "express";
const router = express.Router();
import { create_post_like, remove_post_like } from '../controllers/likes_controller';
import checkUserExists from '../middleware/auth/check_user_exists';

router.post('/post/:PostId/:UserId', checkUserExists, create_post_like);

router.delete('/post/:PostId/:UserId', checkUserExists, remove_post_like)

export default router;