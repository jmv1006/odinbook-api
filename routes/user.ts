import express from "express";
const router = express.Router();
import { get_all_users, get_specific_user, get_user_friends, create_friends, edit_user_details } from '../controllers/user_controller';
import checkUserExists from '../middleware/check_user_exists';

router.get('/all', get_all_users);

router.get('/:UserId', checkUserExists, get_specific_user)

router.put('/:UserId', checkUserExists, edit_user_details)

router.get('/:UserId/friends', checkUserExists, get_user_friends)

router.post('/:User1Id/friends/:User2Id', create_friends)

export default router;