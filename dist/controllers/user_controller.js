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
exports.profileImgDelete = exports.handleProfileImg = exports.edit_user_details = exports.create_friends = exports.get_user_friends = exports.get_specific_user = exports.get_all_users = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const joi_1 = __importDefault(require("joi"));
const redis_config_1 = __importDefault(require("../config/redis/redis.config"));
const prisma = new client_1.PrismaClient();
const get_all_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield prisma.users.findMany({ select: { Id: true, DisplayName: true, Email: true, ProfileImg: true } });
    res.status(200).json(allUsers);
});
exports.get_all_users = get_all_users;
const get_specific_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.findFirst({ where: { Id: req.params.UserId }, select: { Id: true, DisplayName: true, Email: true, ProfileImg: true } });
    yield redis_config_1.default.setEx(`/users/${req.params.UserId}`, 3600, JSON.stringify(user));
    res.json({ user: user });
});
exports.get_specific_user = get_specific_user;
const get_user_friends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //finds frienships where user is a member
    const friendships = yield prisma.friendships.findMany({ where: { OR: [{ User1: req.params.UserId }, { User2: req.params.UserId }] } });
    //filters out Ids of friends and into an array
    const friendsIds = friendships.map(friendship => friendship.User1 === req.params.UserId ? friendship.User2 : friendship.User1);
    //finds friends
    const friends = yield prisma.users.findMany({ where: { Id: { in: friendsIds } }, select: { Id: true, DisplayName: true, Email: true } });
    //adding users friendlist to cache
    yield redis_config_1.default.setEx(`/friends/${req.params.UserId}`, 3600, JSON.stringify(friends));
    res.json({ friends: friends });
});
exports.get_user_friends = get_user_friends;
const create_friends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //If User Ids provided are the same
    if (req.params.User1Id === req.params.User2Id)
        return res.status(400).json({ message: "Cannot Create A Friendship Using Two Of The Same User!" });
    //If frienship already exists
    const friendship = yield prisma.friendships.findFirst({ where: { OR: [{ User1: req.params.User1Id, User2: req.params.User2Id }, { User1: req.params.User2Id, User2: req.params.User1Id }] } });
    if (friendship)
        return res.status(400).json({ message: "Friendship Between Users Already Exists" });
    //check if both users exist
    const user1 = yield prisma.users.findFirst({ where: { Id: req.params.User1Id } });
    const user2 = yield prisma.users.findFirst({ where: { Id: req.params.User2Id } });
    if (!user1 || !user2)
        return res.status(400).json({ message: "At least one of the users does not exist" });
    //if they exist, create a friendship between them
    yield prisma.friendships.create({
        data: {
            Id: (0, uuid_1.v4)(),
            User1: req.params.User1Id,
            User2: req.params.User2Id
        }
    });
    res.status(200).json({ message: "Successfully Created Friendship" });
});
exports.create_friends = create_friends;
const edit_user_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        Email: joi_1.default.string()
            .email()
            .min(3),
        DisplayName: joi_1.default.string()
            .min(3)
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error)
        return res.status(400).json({ message: "error updating user details" });
    yield prisma.users.update({
        where: {
            Id: req.params.UserId
        },
        data: {
            Email: req.body.Email,
            DisplayName: req.body.DisplayName
        }
    });
    //deleting existing user details from cache, if they exist
    yield redis_config_1.default.del(`/users/${req.params.UserId}`);
    res.status(200).json({ message: "Successfully Updated User" });
});
exports.edit_user_details = edit_user_details;
const handleProfileImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).json({ message: 'No File Sent In Request' });
    const file = req.file;
    yield prisma.users.update({ where: { Id: req.params.UserId }, data: { ProfileImg: file.location } });
    return res.status(200).json({ message: 'File Successfully Uploaded' });
});
exports.handleProfileImg = handleProfileImg;
const profileImgDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.users.update({ where: { Id: req.params.UserId }, data: { ProfileImg: null } });
    return res.status(200).json({ message: 'Image Successfully Deleted' });
});
exports.profileImgDelete = profileImgDelete;
