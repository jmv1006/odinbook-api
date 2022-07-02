import express from "express";
const router = express.Router();
import { create_post_like, remove_post_like } from '../controllers/likes_controller';

router.post('/post/:PostId/:UserId', create_post_like);

router.delete('/post/:PostId/:UserId', remove_post_like)

export default router;