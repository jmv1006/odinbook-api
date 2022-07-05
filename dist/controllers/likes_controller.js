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
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_post_likes = exports.remove_post_like = exports.create_post_like = void 0;
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const create_post_like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postIsLiked = yield prisma.post_Likes.findFirst({ where: { User: req.params.UserId, Post: req.params.PostId } });
    if (postIsLiked)
        return res.status(400).json({ message: "Post Is Already Liked" });
    yield prisma.post_Likes.create({
        data: {
            Id: (0, uuid_1.v4)(),
            User: req.params.UserId,
            Post: req.params.PostId
        }
    });
    return res.status(200).json({ message: "Successfully Created Like" });
});
exports.create_post_like = create_post_like;
const remove_post_like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.post_Likes.deleteMany({ where: { User: req.params.UserId, Post: req.params.PostId } });
    res.status(200).json({ message: "Successfully Removed Like" });
});
exports.remove_post_like = remove_post_like;
const get_post_likes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const likes = yield prisma.post_Likes.findMany();
    res.json({ likes: likes, amount: likes.length });
});
exports.get_post_likes = get_post_likes;
