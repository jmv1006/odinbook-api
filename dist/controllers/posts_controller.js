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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const get_all_posts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield prisma.posts.findMany();
    if (posts === null)
        return res.status(400).json({ message: "No Posts!" });
    return res.status(200).json(posts);
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
    const user = yield prisma.users.findFirst({ where: { Id: req.params.UserId } });
    if (!user)
        return res.status(400).json({ message: "User Does Not Exist" });
    yield prisma.posts.create({
        data: {
            Id: (0, uuid_1.v4)(),
            UserId: req.params.UserId,
            Text: req.body.Text
        }
    });
    return res.status(200).json({ message: "Successfully Created Post" });
});
exports.create_post = create_post;
const get_timeline_posts = (req, res) => {
    //Select from friendships
    //Design an algoritm that gets me the users post AND the posts of their friends
    //SELECT from Posts WHERE Id=UserId or Id in()
};
exports.get_timeline_posts = get_timeline_posts;
