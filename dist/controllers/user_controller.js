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
exports.profileImgDelete = exports.handleProfileImg = exports.edit_user_details = exports.get_specific_user = exports.get_all_users = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const redis_config_1 = __importDefault(require("../config/redis/redis.config"));
const prisma = new client_1.PrismaClient();
const get_all_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield prisma.users.findMany({ select: { Id: true, DisplayName: true, ProfileImg: true } });
    yield redis_config_1.default.setEx(`/users/all`, 500, JSON.stringify(allUsers));
    res.status(200).json({ users: allUsers });
});
exports.get_all_users = get_all_users;
const get_specific_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.findFirst({ where: { Id: req.params.UserId }, select: { Id: true, DisplayName: true, Email: true, ProfileImg: true } });
    yield redis_config_1.default.setEx(`/users/${req.params.UserId}`, 3600, JSON.stringify(user));
    res.json({ user: user });
});
exports.get_specific_user = get_specific_user;
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
    const updatedUser = yield prisma.users.update({
        where: {
            Id: req.params.UserId
        },
        data: {
            Email: req.body.Email,
            DisplayName: req.body.DisplayName
        },
        select: {
            Id: true,
            DisplayName: true,
            Email: true,
            ProfileImg: true
        }
    });
    //deleting existing user details from cache, if they exist
    yield redis_config_1.default.del(`/users/${req.params.UserId}`);
    yield redis_config_1.default.del(`/users/all`);
    res.status(200).json({ updatedUser: updatedUser });
});
exports.edit_user_details = edit_user_details;
const handleProfileImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).json({ message: 'No File Sent In Request' });
    const file = req.file;
    yield prisma.users.update({ where: { Id: req.params.UserId }, data: { ProfileImg: file.location } });
    yield redis_config_1.default.del(`/users/all`);
    return res.status(200).json({ message: 'File Successfully Uploaded' });
});
exports.handleProfileImg = handleProfileImg;
const profileImgDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.users.update({ where: { Id: req.params.UserId }, data: { ProfileImg: null } });
    yield redis_config_1.default.del(`/users/all`);
    return res.status(200).json({ message: 'Image Successfully Deleted' });
});
exports.profileImgDelete = profileImgDelete;
