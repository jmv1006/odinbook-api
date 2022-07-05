import express from "express";
const router = express.Router();
import { create_comment } from '../controllers/comments_controller'
import checkUserExists from '../middleware/auth/check_user_exists';

router.post('/:PostId/:UserId', checkUserExists, create_comment)

export default router;