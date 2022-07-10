import express from "express";
const router = express.Router();
import { create_comment, get_post_comments } from '../controllers/comments_controller'
import checkUserExists from '../middleware/auth/check_user_exists';

router.post('/:PostId/:UserId', checkUserExists, create_comment)

router.get('/:PostId', get_post_comments)

export default router;