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
exports.get_post_comments = exports.create_comment = void 0;
const uuid_1 = require("uuid");
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const create_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        Text: joi_1.default.string()
            .min(1)
            .max(1000)
            .required(),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error)
        return res.status(400).json({ message: "Input Error" });
    const postExists = yield prisma.posts.findUnique({ where: { Id: req.params.PostId } });
    if (!postExists)
        return res.status(400).json({ message: "Post Does Not Exist" });
    yield prisma.comments.create({
        data: {
            Id: (0, uuid_1.v4)(),
            Text: req.body.Text,
            User: req.params.UserId,
            Post: req.params.PostId,
            Date: new Date()
        }
    });
    res.status(200).json({ message: "Successfully Created Comment" });
});
exports.create_comment = create_comment;
const get_post_comments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield prisma.comments.findMany({ where: { Post: req.params.PostId }, select: { Id: true, Post: true, Text: true, Date: true, Users: { select: { Id: true, DisplayName: true, Email: true, ProfileImg: true } } }, orderBy: { Date: 'asc' }, });
    if (!comments)
        return res.status(400).json({ message: "Error finding comments for post" });
    return res.status(200).json({ comments: comments, amount: comments.length });
});
exports.get_post_comments = get_post_comments;
