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
const check_if_exists_1 = require("../helpers/check_if_exists");
const get_all_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json('All users here');
});
exports.get_all_users = get_all_users;
const get_specific_user = (req, res) => {
    res.json("Specific User Info");
};
exports.get_specific_user = get_specific_user;
const get_user_friends = (req, res) => {
    //select from friendships where user1 or user2 equals userId
    res.json("user friends here");
};
exports.get_user_friends = get_user_friends;
const create_friends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if both users exist
    const user1Exists = yield (0, check_if_exists_1.check_if_user_exists)(req.params.User1Id);
    const user2Exists = yield (0, check_if_exists_1.check_if_user_exists)(req.params.User2Id);
    if (!user1Exists || !user2Exists)
        return res.status(400).json({ message: "Error Creating Friendship" });
    res.json("Post friends here");
});
exports.create_friends = create_friends;
