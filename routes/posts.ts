import express from "express";
const router = express.Router();
import { get_all_posts, create_post, get_timeline_posts, get_user_posts, get_pagninated_posts, delete_post, edit_post } from '../controllers/posts_controller';
import checkPostExists from "../middleware/auth/check_post_exists";
import checkUserExists from '../middleware/auth/check_user_exists';

router.get('/all', get_all_posts);

router.post('/:UserId', checkUserExists, create_post);

router.get('/:UserId', checkUserExists, get_user_posts)

router.get('/:UserId/timeline', checkUserExists, get_timeline_posts);

router.get('/:UserId/timeline/paginated/:PageNumber', checkUserExists, get_pagninated_posts);

router.delete('/:PostId', checkPostExists, delete_post);

router.put('/:PostId', checkPostExists, edit_post)

export default router;