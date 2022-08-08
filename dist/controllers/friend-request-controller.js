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
exports.get_all_user_requests = exports.get_user_sent_requests = exports.get_user_recieved_requests = exports.check_request_exists = exports.delete_request = exports.create_request = exports.get_all_requests = void 0;
const uuid_1 = require("uuid");
const initialize_client_1 = __importDefault(require("../config/prisma/initialize-client"));
const get_all_requests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requests = yield initialize_client_1.default.friend_requests.findMany();
    res.status(200).json({ requests: requests });
});
exports.get_all_requests = get_all_requests;
const create_request = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.From_Id === req.params.To_Id)
        return res.status(400).json({ message: "Cannot create a friend request between two of the same user" });
    const user1Exists = yield initialize_client_1.default.users.findUnique({ where: { Id: req.params.From_Id } });
    const user2Exists = yield initialize_client_1.default.users.findUnique({ where: { Id: req.params.To_Id } });
    if (!user1Exists || !user2Exists)
        return res.status(400).json({ message: "At least one of the users does not exist" });
    const existingRequest = yield initialize_client_1.default.friend_requests.findFirst({ where: { OR: [{ From_uuid: req.params.From_Id, To_uuid: req.params.To_Id }, { From_uuid: req.params.To_Id, To_uuid: req.params.From_Id }] } });
    if (existingRequest)
        return res.status(400).json({ message: "Request between user already exists" });
    const request = yield initialize_client_1.default.friend_requests.create({
        data: {
            Id: (0, uuid_1.v4)(),
            From_uuid: req.params.From_Id,
            To_uuid: req.params.To_Id,
            Is_Accepted: false
        }
    });
    res.status(200).json({ request: request });
});
exports.create_request = create_request;
const delete_request = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestExists = yield initialize_client_1.default.friend_requests.findUnique({ where: { Id: req.params.RequestId } });
    if (!requestExists)
        return res.status(400).json({ message: "Friend Request Does Not Exist" });
    yield initialize_client_1.default.friend_requests.delete({
        where: {
            Id: req.params.RequestId
        }
    });
    res.status(200).json({ message: "Successfully Deleted Request" });
});
exports.delete_request = delete_request;
const check_request_exists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield initialize_client_1.default.friend_requests.findFirst({ where: { OR: [{ From_uuid: req.params.From_Id, To_uuid: req.params.To_Id }, { From_uuid: req.params.To_Id, To_uuid: req.params.From_Id }] } });
    if (request)
        return res.status(200).json({ exists: true, request: request });
    return res.status(200).json({ exists: false });
});
exports.check_request_exists = check_request_exists;
const get_user_recieved_requests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requests = yield initialize_client_1.default.friend_requests.findMany({ where: { To_uuid: req.params.UserId }, include: { Users_UsersTofriend_requests_From_uuid: { select: { Id: true, Email: true, ProfileImg: true, DisplayName: true } } } });
    return res.status(200).json({ requests: requests });
});
exports.get_user_recieved_requests = get_user_recieved_requests;
const get_user_sent_requests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requests = yield initialize_client_1.default.friend_requests.findMany({ where: { From_uuid: req.params.UserId }, include: { Users_UsersTofriend_requests_To_uuid: { select: { Id: true, Email: true, ProfileImg: true, DisplayName: true } } } });
    return res.status(200).json({ requests: requests });
});
exports.get_user_sent_requests = get_user_sent_requests;
const get_all_user_requests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requests = yield initialize_client_1.default.friend_requests.findMany({ where: { OR: [{ To_uuid: req.params.UserId }, { From_uuid: req.params.UserId }] } });
    return res.status(200).json({ requests: requests });
});
exports.get_all_user_requests = get_all_user_requests;
