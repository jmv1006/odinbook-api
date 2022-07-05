"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = require("../controllers/user_controller");
const check_user_exists_1 = __importDefault(require("../middleware/auth/check_user_exists"));
const checkUsersCache_1 = __importDefault(require("../middleware/cache/checkUsersCache"));
const multer_config_1 = __importDefault(require("../config/multer/multer-config"));
const deletingExistingProfileImg_1 = __importDefault(require("../middleware/aws/deletingExistingProfileImg"));
router.get('/all', user_controller_1.get_all_users);
router.get('/:UserId', check_user_exists_1.default, checkUsersCache_1.default, user_controller_1.get_specific_user);
router.put('/:UserId', check_user_exists_1.default, user_controller_1.edit_user_details);
router.post('/:UserId/profile-img', check_user_exists_1.default, multer_config_1.default.single('image'), user_controller_1.handleProfileImg);
//PUT profile-img route differs from POST because it DELETES an existing image if it exists...
router.put('/:UserId/profile-img', check_user_exists_1.default, deletingExistingProfileImg_1.default, multer_config_1.default.single('image'), user_controller_1.handleProfileImg);
router.delete('/:UserId/profile-img', deletingExistingProfileImg_1.default, user_controller_1.profileImgDelete);
exports.default = router;
