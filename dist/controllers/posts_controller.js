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
exports.get_timeline_posts = exports.create_post = exports.get_all_posts = void 0;
const joi_1 = __importDefault(require("joi"));
const uuid_1 = require("uuid");
const initialize_client_1 = __importDefault(require("../config/prisma/initialize-client"));
const get_all_posts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield initialize_client_1.default.posts.findMany({ orderBy: { Date: 'desc' }, select: { Id: true, Text: true, Date: true, Users: { select: { Id: true, DisplayName: true, Email: true } } } });
    if (!posts)
        return res.status(400).json({ message: "No Posts!" });
    console.log(posts);
    return res.status(200).json({ posts: posts });
});
exports.get_all_posts = get_all_posts;
const create_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        Text: joi_1.default.string()
            .min(1)
            .required(),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error)
        return res.status(400).json("Error Creating Post");
    yield initialize_client_1.default.posts.create({
        data: {
            Id: (0, uuid_1.v4)(),
            UserId: req.params.UserId,
            Text: req.body.Text,
            Date: new Date()
        }
    });
    return res.status(200).json({ message: "Successfully Created Post" });
});
exports.create_post = create_post;
const get_timeline_posts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //finds frienships where user is a member
    const friendships = yield initialize_client_1.default.friendships.findMany({ where: { OR: [{ User1: req.params.UserId }, { User2: req.params.UserId }] } });
    //filters out Ids of friends and into an array
    const friendsIds = friendships.map(friendship => friendship.User1 === req.params.UserId ? friendship.User2 : friendship.User1);
    const postsI = yield initialize_client_1.default.posts.findMany({ where: { OR: [{ UserId: req.params.UserId }, { UserId: { in: friendsIds } }] }, select: { Id: true, Text: true, Date: true, Users: { select: { Id: true, DisplayName: true, Email: true, ProfileImg: true } } }, orderBy: { Date: 'desc' } });
    res.status(200).json({ posts: postsI });
});
exports.get_timeline_posts = get_timeline_posts;
