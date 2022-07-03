import express from "express";
const router = express.Router();
import { get_all_users, get_specific_user, get_user_friends, create_friends } from '../controllers/user_controller';

router.get('/all', get_all_users);

router.get('/:UserId', get_specific_user)

router.get('/:UserId/friends', get_user_friends)

router.post('/:User1Id/friends/:User2Id', create_friends)

export default router;