import express from "express";
const router = express.Router();
import { get_all_users, get_specific_user, get_user_friends, create_friends, edit_user_details, handleProfileImg, profileImgDelete } from '../controllers/user_controller';
import checkUserExists from '../middleware/auth/check_user_exists';
import checkFriendsCache from '../middleware/cache/checkFriendsCache';
import checkUsersCache from '../middleware/cache/checkUsersCache';
import upload from "../config/multer/multer-config";
import deleteExistingProfileImg from '../middleware/aws/deletingExistingProfileImg';

router.get('/all', get_all_users);

router.get('/:UserId', checkUserExists, checkUsersCache, get_specific_user)

router.put('/:UserId', checkUserExists, edit_user_details);

router.post('/:UserId/profile-img', checkUserExists, upload.single('image'), handleProfileImg);

//PUT profile-img route differs from POST because it DELETES an existing image if it exists...
router.put('/:UserId/profile-img', checkUserExists, deleteExistingProfileImg, upload.single('image'), handleProfileImg);

router.delete('/:UserId/profile-img', deleteExistingProfileImg, profileImgDelete);

router.get('/:UserId/friends', checkUserExists, checkFriendsCache, get_user_friends)

router.post('/:User1Id/friends/:User2Id', create_friends)

export default router;