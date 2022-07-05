import express from "express";
const router = express.Router();
import checkUserExists from '../middleware/auth/check_user_exists';
import checkFriendsCache from '../middleware/cache/checkFriendsCache';
import { get_user_friends, create_friends, delete_friends} from '../controllers/friendships_controller';

router.get('/:UserId/', checkUserExists, checkFriendsCache, get_user_friends);

router.post('/:User1Id/:User2Id', create_friends);

router.delete(`/:FriendshipId`, delete_friends)

export default router;