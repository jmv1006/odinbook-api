"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const posts_controller_1 = require("../controllers/posts_controller");
router.get('/all', posts_controller_1.get_all_posts);
router.post('/:UserId', posts_controller_1.create_post);
router.post('/:UserId/timeline', posts_controller_1.get_timeline_posts);
exports.default = router;
