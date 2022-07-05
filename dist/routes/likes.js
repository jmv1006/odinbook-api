"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const likes_controller_1 = require("../controllers/likes_controller");
const check_user_exists_1 = __importDefault(require("../middleware/auth/check_user_exists"));
router.post('/post/:PostId/:UserId', check_user_exists_1.default, likes_controller_1.create_post_like);
router.delete('/post/:PostId/:UserId', check_user_exists_1.default, likes_controller_1.remove_post_like);
exports.default = router;
