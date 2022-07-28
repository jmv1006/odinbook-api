import express from "express";
const router = express.Router();
import { get_all_users, get_specific_user,get_profile_info, edit_user_details, handleProfileImg, profileImgDelete, update_profile_info } from '../controllers/user_controller';
import checkUserExists from '../middleware/auth/check_user_exists';
import checkUsersCache from '../middleware/cache/checkUsersCache';
import {uploadProfileImage} from "../config/multer/multer-config";
import deleteExistingProfileImg from '../middleware/aws/deletingExistingProfileImg';
import allUsersCache from '../middleware/cache/allUsersCache';

router.get('/all', allUsersCache, get_all_users);

router.get('/:UserId', checkUserExists, checkUsersCache, get_specific_user)

router.put('/:UserId', checkUserExists, edit_user_details);

router.get('/:UserId/profile', checkUserExists, get_profile_info);

router.put('/:UserId/profile', checkUserExists, update_profile_info);

router.post('/:UserId/profile-img', checkUserExists, uploadProfileImage.single('image'), handleProfileImg);

//PUT profile-img route differs from POST because it DELETES an existing image if it exists...
router.put('/:UserId/profile-img', checkUserExists, deleteExistingProfileImg, uploadProfileImage.single('image'), handleProfileImg);

router.delete('/:UserId/profile-img', deleteExistingProfileImg, profileImgDelete);

export default router;