import express from "express";
const router = express.Router();
import { create_comment } from '../controllers/comments_controller'

router.post('/:PostId/:UserId', create_comment)

export default router;