"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const likes_controller_1 = require("../controllers/likes_controller");
const check_user_exists_1 = __importDefault(require("../middleware/auth/check_user_exists"));
const check_post_exists_1 = __importDefault(require("../middleware/auth/check_post_exists"));
router.get('/post/:PostId', check_post_exists_1.default, likes_controller_1.get_post_likes);
router.post('/post/:PostId/:UserId', check_user_exists_1.default, check_post_exists_1.default, likes_controller_1.toggle_post_like);
exports.default = router;
//# sourceMappingURL=likes.js.map