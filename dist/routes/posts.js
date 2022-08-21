"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const posts_controller_1 = require("../controllers/posts_controller");
const check_post_exists_1 = __importDefault(require("../middleware/auth/check_post_exists"));
const check_user_exists_1 = __importDefault(require("../middleware/auth/check_user_exists"));
const multer_config_1 = require("../config/multer/multer-config");
const deletePostImg_1 = __importDefault(require("../middleware/aws/deletePostImg"));
const handlePostEdit_1 = __importDefault(require("../middleware/posts/handlePostEdit"));
router.post('/:UserId', check_user_exists_1.default, multer_config_1.uploadPostImage.single('image'), posts_controller_1.create_post);
router.get('/:UserId', check_user_exists_1.default, posts_controller_1.get_user_posts);
router.get('/:UserId/timeline', check_user_exists_1.default, posts_controller_1.get_timeline_posts);
router.get('/:UserId/timeline/paginated/', check_user_exists_1.default, posts_controller_1.get_pagninated_posts);
router.delete('/:PostId', check_post_exists_1.default, deletePostImg_1.default, posts_controller_1.delete_post);
router.put('/:PostId', check_post_exists_1.default, multer_config_1.uploadPostImage.single('image'), handlePostEdit_1.default, posts_controller_1.edit_post);
exports.default = router;
//# sourceMappingURL=posts.js.map