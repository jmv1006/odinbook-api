"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const posts_controller_1 = require("../controllers/posts_controller");
const check_user_exists_1 = __importDefault(require("../middleware/auth/check_user_exists"));
router.get('/all', posts_controller_1.get_all_posts);
router.post('/:UserId', check_user_exists_1.default, posts_controller_1.create_post);
router.get('/:UserId/timeline', check_user_exists_1.default, posts_controller_1.get_timeline_posts);
exports.default = router;
