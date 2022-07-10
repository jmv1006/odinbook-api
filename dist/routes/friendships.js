"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const check_user_exists_1 = __importDefault(require("../middleware/auth/check_user_exists"));
const checkFriendsCache_1 = __importDefault(require("../middleware/cache/checkFriendsCache"));
const friendships_controller_1 = require("../controllers/friendships_controller");
router.get('/all', friendships_controller_1.get_all_friendships);
router.get('/:UserId', check_user_exists_1.default, checkFriendsCache_1.default, friendships_controller_1.get_user_friends);
router.post('/:User1Id/:User2Id', friendships_controller_1.create_friends);
router.delete(`/:FriendshipId`, friendships_controller_1.delete_friends);
exports.default = router;
