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
exports.create_friends = exports.get_user_friends = exports.get_specific_user = exports.get_all_users = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const get_all_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield prisma.users.findMany();
    res.json(allUsers);
});
exports.get_all_users = get_all_users;
const get_specific_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.findFirst({ where: { Id: req.params.UserId } });
    res.json({ user: user });
});
exports.get_specific_user = get_specific_user;
const get_user_friends = (req, res) => {
    //select from friendships where user1 or user2 equals userId
    res.json("user friends here");
};
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
