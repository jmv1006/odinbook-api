import express from "express";
const router = express.Router();
import { create_post, get_timeline_posts, get_user_posts, get_pagninated_posts, delete_post, edit_post, get_specific_post } from '../controllers/posts_controller';
import checkPostExists from "../middleware/auth/check_post_exists";
import checkUserExists from '../middleware/auth/check_user_exists';
import {uploadPostImage} from '../config/multer/multer-config'
import deletePostImg from '../middleware/aws/deletePostImg'
import handlePostEdit from '../middleware/posts/handlePostEdit';

router.post('/:UserId', checkUserExists, uploadPostImage.single('image'),  create_post);

router.get('/:PostId', checkPostExists, get_specific_post);

router.get('/user/:UserId', checkUserExists, get_user_posts);

router.get('/:UserId/timeline', checkUserExists, get_timeline_posts);

router.get('/:UserId/timeline/paginated/', checkUserExists, get_pagninated_posts);

router.delete('/:PostId', checkPostExists, deletePostImg, delete_post);

router.put('/:PostId', checkPostExists, uploadPostImage.single('image'), handlePostEdit, edit_post);

export default router;