"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = require("../controllers/user_controller");
const check_user_exists_1 = __importDefault(require("../middleware/check_user_exists"));
const checkFriendsCache_1 = __importDefault(require("../middleware/cache/checkFriendsCache"));
const checkUsersCache_1 = __importDefault(require("../middleware/cache/checkUsersCache"));
router.get('/all', user_controller_1.get_all_users);
router.get('/:UserId', check_user_exists_1.default, checkUsersCache_1.default, user_controller_1.get_specific_user);
router.put('/:UserId', check_user_exists_1.default, user_controller_1.edit_user_details);
router.get('/:UserId/friends', check_user_exists_1.default, checkFriendsCache_1.default, user_controller_1.get_user_friends);
router.post('/:User1Id/friends/:User2Id', user_controller_1.create_friends);
exports.default = router;
