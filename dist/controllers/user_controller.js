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
const prisma = new client_1.PrismaClient();
const get_all_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield prisma.users.findMany();
    res.json(allUsers);
});
exports.get_all_users = get_all_users;
const get_specific_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.findFirst({ where: { Id: req.params.UserId } });
    if (user === null)
        return res.status(400).json({ message: "User Does Not Exist" });
    res.json(user);
});
exports.get_specific_user = get_specific_user;
const get_user_friends = (req, res) => {
    //select from friendships where user1 or user2 equals userId
    res.json("user friends here");
};
exports.get_user_friends = get_user_friends;
const create_friends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if both users exist
    res.json("Post friends here");
});
exports.create_friends = create_friends;
