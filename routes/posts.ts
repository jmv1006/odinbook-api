import express from "express";
const router = express.Router();
import { create_post, get_timeline_posts, get_user_posts, get_pagninated_posts, delete_post, edit_post } from '../controllers/posts_controller';
import checkPostExists from "../middleware/auth/check_post_exists";
import checkUserExists from '../middleware/auth/check_user_exists';
import checkUserPostsCache from '../middleware/cache/user-posts-cache';

router.post('/:UserId', checkUserExists, create_post);

router.get('/:UserId', checkUserExists, get_user_posts);

router.get('/:UserId/timeline', checkUserExists, get_timeline_posts);

router.get('/:UserId/timeline/paginated/', checkUserExists, get_pagninated_posts);

router.delete('/:PostId', checkPostExists, delete_post);

router.put('/:PostId', checkPostExists, edit_post);


export default router;