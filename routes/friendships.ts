import express from "express";
const router = express.Router();
import checkUserExists from '../middleware/auth/check_user_exists';
import checkFriendsCache from '../middleware/cache/checkFriendsCache';
import { get_user_friends, create_friends, delete_friends, get_all_friendships} from '../controllers/friendships_controller';


router.get('/all', get_all_friendships)

router.get('/:UserId', checkUserExists, checkFriendsCache, get_user_friends);

router.post('/:User1Id/:User2Id', create_friends);

router.delete(`/:User1/:User2`, delete_friends);

export default router;