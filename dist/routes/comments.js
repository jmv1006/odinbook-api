"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comments_controller_1 = require("../controllers/comments_controller");
const check_user_exists_1 = __importDefault(require("../middleware/auth/check_user_exists"));
router.post('/:PostId/:UserId', check_user_exists_1.default, comments_controller_1.create_comment);
router.get('/:PostId', comments_controller_1.get_post_comments);
router.delete('/:CommentId', comments_controller_1.delete_comment);
exports.default = router;
//# sourceMappingURL=comments.js.map