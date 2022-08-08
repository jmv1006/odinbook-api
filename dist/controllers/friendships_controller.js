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
exports.get_suggested_friends = exports.delete_friends = exports.create_friends = exports.get_user_friends = exports.get_all_friendships = void 0;
const uuid_1 = require("uuid");
const redis_config_1 = require("../config/redis/redis.config");
const initialize_client_1 = __importDefault(require("../config/prisma/initialize-client"));
const client = (0, redis_config_1.getClient)();
const get_all_friendships = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const friendships = yield initialize_client_1.default.friendships.findMany();
    res.json(friendships);
});
exports.get_all_friendships = get_all_friendships;
const get_user_friends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //finds frienships where user is a member
    const friendships = yield initialize_client_1.default.friendships.findMany({ where: { OR: [{ User1: req.params.UserId }, { User2: req.params.UserId }] } });
    //filters out Ids of friends and into an array
    const friendsIds = friendships.map(friendship => friendship.User1 === req.params.UserId ? friendship.User2 : friendship.User1);
    //finds friends
    const friends = yield initialize_client_1.default.users.findMany({ where: { Id: { in: friendsIds } }, select: { Id: true, DisplayName: true, Email: true, ProfileImg: true } });
    //adding users friendlist to cache
    yield client.setEx(`/friends/${req.params.UserId}`, 3600, JSON.stringify(friends));
    res.json({ friends: friends });
});
exports.get_user_friends = get_user_friends;
const create_friends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //If User Ids provided are the same
    if (req.params.User1Id === req.params.User2Id)
        return res.status(400).json({ message: "Cannot Create A Friendship Using Two Of The Same User!" });
    //If frienship already exists
    const friendship = yield initialize_client_1.default.friendships.findFirst({ where: { OR: [{ User1: req.params.User1Id, User2: req.params.User2Id }, { User1: req.params.User2Id, User2: req.params.User1Id }] } });
    if (friendship)
        return res.status(400).json({ message: "Friendship Between Users Already Exists" });
    //check if both users exist
    const user1 = yield initialize_client_1.default.users.findFirst({ where: { Id: req.params.User1Id } });
    const user2 = yield initialize_client_1.default.users.findFirst({ where: { Id: req.params.User2Id } });
    if (!user1 || !user2)
        return res.status(400).json({ message: "At least one of the users does not exist" });
    //if they exist, create a friendship between them
    yield initialize_client_1.default.friendships.create({
        data: {
            Id: (0, uuid_1.v4)(),
            User1: req.params.User1Id,
            User2: req.params.User2Id
        }
    });
    yield client.del(`/friends/${req.params.User1Id}`);
    yield client.del(`/friends/${req.params.User2Id}`);
    const request = yield initialize_client_1.default.friend_requests.findFirst({ where: { OR: [{ From_uuid: req.params.User1Id, To_uuid: req.params.User2Id }, { From_uuid: req.params.User2Id, To_uuid: req.params.User1Id }] } });
    yield initialize_client_1.default.friend_requests.delete({ where: { Id: request === null || request === void 0 ? void 0 : request.Id } });
    res.status(200).json({ message: "Successfully Created Friendship" });
});
exports.create_friends = create_friends;
const delete_friends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const friendship = yield initialize_client_1.default.friendships.findFirst({ where: { OR: [{ User1: req.params.User1, User2: req.params.User2 }, { User1: req.params.User2, User2: req.params.User1 }] } });
    if (!friendship)
        return res.status(400).json({ message: "Friendship with given ID does not exist" });
    yield client.del(`/friends/${friendship.User1}`);
    yield client.del(`/friends/${friendship.User2}`);
    yield initialize_client_1.default.friendships.delete({ where: { Id: friendship.Id } });
    res.status(200).json({ message: "Successfully Deleted Friendship" });
});
exports.delete_friends = delete_friends;
const get_suggested_friends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get suggested friends: how?
    const adjancency_list = {};
    //for each of user friends, create a graph node
    const friendships = yield initialize_client_1.default.friendships.findMany({ where: { OR: [{ User1: req.params.UserId }, { User2: req.params.UserId }] } });
    //filters out Ids of friends and into an array
    const friendsIds = friendships.map(friendship => friendship.User1 === req.params.UserId ? friendship.User2 : friendship.User1);
    adjancency_list[req.params.UserId] = [];
    friendsIds.forEach(id => {
        adjancency_list[req.params.UserId].push(id);
    });
    friendsIds.forEach(id => {
        adjancency_list[id] = [];
        adjancency_list[id].push(req.params.UserId);
        //add all this users friends
        initialize_client_1.default.friendships.findMany({ where: { OR: [{ User1: id }, { User2: req.params.id }] } }).then(res => {
            console.log(res);
        });
    });
    //at this point, all of the users friends are in the graph
    console.log(adjancency_list);
    res.send("here");
});
exports.get_suggested_friends = get_suggested_friends;
