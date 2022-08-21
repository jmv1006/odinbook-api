"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggle_post_like = exports.get_post_likes = void 0;
const uuid_1 = require("uuid");
const initialize_client_1 = __importDefault(require("../config/prisma/initialize-client"));
const get_post_likes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const likes = yield initialize_client_1.default.post_Likes.findMany({ where: { Post: req.params.PostId } });
    res.json({ likes: likes, amount: likes.length });
});
exports.get_post_likes = get_post_likes;
const toggle_post_like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postIsLiked = yield initialize_client_1.default.post_Likes.findFirst({ where: { User: req.params.UserId, Post: req.params.PostId } });
    if (postIsLiked) {
        yield initialize_client_1.default.post_Likes.deleteMany({ where: { User: req.params.UserId, Post: req.params.PostId } });
        yield initialize_client_1.default.notifications.deleteMany({ where: { From_User: req.params.UserId } });
        return res.status(200).json({ message: "Successfully Removed Like" });
    }
    const postToBeLiked = yield initialize_client_1.default.posts.findUnique({ where: { Id: req.params.PostId } });
    if ((postToBeLiked === null || postToBeLiked === void 0 ? void 0 : postToBeLiked.UserId) !== req.params.UserId) {
        //create a notification
        yield initialize_client_1.default.notifications.create({
            data: {
                Id: (0, uuid_1.v4)(),
                From_User: req.params.UserId,
                To_User: postToBeLiked === null || postToBeLiked === void 0 ? void 0 : postToBeLiked.UserId,
                Notification_Type: 'like',
                Post_Id: postToBeLiked === null || postToBeLiked === void 0 ? void 0 : postToBeLiked.Id
            }
        });
    }
    yield initialize_client_1.default.post_Likes.create({
        data: {
            Id: (0, uuid_1.v4)(),
            User: req.params.UserId,
            Post: req.params.PostId
        }
    });
    return res.status(200).json({ message: "Successfully Created Like" });
});
exports.toggle_post_like = toggle_post_like;
//# sourceMappingURL=likes_controller.js.map