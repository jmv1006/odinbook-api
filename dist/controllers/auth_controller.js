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
exports.check_for_token = exports.log_in_facebook_success = exports.sign_up = exports.log_in_guest = exports.log_in = void 0;
const joi_1 = __importDefault(require("joi"));
const uuid_1 = require("uuid");
const bcryptjs_1 = require("bcryptjs");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = require("jsonwebtoken");
const redis_config_1 = require("../config/redis/redis.config");
const initialize_client_1 = __importDefault(require("../config/prisma/initialize-client"));
const client = (0, redis_config_1.getClient)();
const log_in = (req, res) => {
    passport_1.default.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json('Server Error');
        }
        if (!user) {
            return res.status(400).json({ message: info.message });
        }
        const tokenUser = {
            Id: user.Id,
            DisplayName: user.DisplayName,
            Email: user.Email,
            ProfileImg: user.ProfileImg
        };
        const tokenSecret = process.env.TOKEN_SECRET;
        const token = (0, jsonwebtoken_1.sign)({ user: tokenUser }, tokenSecret, { expiresIn: '15m' });
        return res.status(200).clearCookie('token').cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: true }).json({
            message: 'Auth Passed',
            user: tokenUser,
        });
    })(req, res);
};
exports.log_in = log_in;
const log_in_guest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield initialize_client_1.default.users.findFirst({ where: { Id: 'ff89861a-552a-496c-9a30-efc3eb79d300' } });
    const tokenUser = {
        Id: user.Id,
        DisplayName: user.DisplayName,
        Email: user.Email,
        ProfileImg: user.ProfileImg
    };
    const tokenSecret = process.env.TOKEN_SECRET;
    const token = (0, jsonwebtoken_1.sign)({ user: tokenUser }, tokenSecret, { expiresIn: '15m' });
    return res.status(200).clearCookie('token').cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: true }).json({
        message: 'Auth Passed',
        user: tokenUser,
    });
});
exports.log_in_guest = log_in_guest;
const sign_up = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        Email: joi_1.default.string()
            .email()
            .min(3)
            .max(30)
            .required(),
        DisplayName: joi_1.default.string()
            .min(3)
            .max(30)
            .required(),
        Password: joi_1.default.string()
            .min(3)
            .required(),
        ConfirmedPassword: joi_1.default.string()
            .min(3)
            .valid(joi_1.default.ref('Password'))
            .required()
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(400).json({ message: "Error Signing Up" });
        return;
    }
    const existingUser = yield initialize_client_1.default.users.findFirst({ where: { Email: req.body.Email } });
    if (existingUser)
        return res.status(400).json({ message: "User Already Exists" });
    (0, bcryptjs_1.hash)(req.body.Password, 10, (err, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield initialize_client_1.default.users.create({
            data: {
                Id: (0, uuid_1.v4)(),
                DisplayName: req.body.DisplayName,
                Email: req.body.Email,
                ProfileImg: "https://i.stack.imgur.com/l60Hf.png",
                Password: hashedPassword
            }
        });
        yield initialize_client_1.default.profile_Info.create({
            data: {
                Id: (0, uuid_1.v4)(),
                UserId: createdUser.Id,
                Bio: ""
            }
        });
        yield client.del(`/users/all`);
        const tokenUser = {
            Id: createdUser.Id,
            DisplayName: createdUser.DisplayName,
            Email: createdUser.Email,
            ProfileImg: createdUser.ProfileImg
        };
        const tokenSecret = process.env.TOKEN_SECRET;
        const token = (0, jsonwebtoken_1.sign)({ user: tokenUser }, tokenSecret, { expiresIn: '15m' });
        return res.status(200).cookie("token", token).json({ user: createdUser });
    }));
});
exports.sign_up = sign_up;
const log_in_facebook_success = (req, res) => {
    res.json(req.user);
};
exports.log_in_facebook_success = log_in_facebook_success;
const check_for_token = (req, res) => {
    if (req.user) {
        res.status(200).json({ user: req.user });
    }
};
exports.check_for_token = check_for_token;
//# sourceMappingURL=auth_controller.js.map