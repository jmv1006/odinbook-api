import express from "express";
const router = express.Router();
import { create_post_like, remove_post_like } from '../controllers/likes_controller';

router.get('/all', (req, res) => {
    res.json("Likes Here")
});

router.post('/:UserId/:PostId', create_post_like);

router.delete('/:UserId/:PostId', remove_post_like)

export default router;