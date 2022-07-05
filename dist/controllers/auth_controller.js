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
exports.check_for_token = exports.log_in_facebook = exports.sign_up = exports.log_in = void 0;
const joi_1 = __importDefault(require("joi"));
const uuid_1 = require("uuid");
const bcryptjs_1 = require("bcryptjs");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const log_in = (req, res) => {
    passport_1.default.authenticate('local', { session: false }, (err, user) => {
        if (err) {
            return res.status(500).json('Server Error');
        }
        if (!user) {
            return res.status(400).json("Error Signing In");
        }
        const tokenUser = {
            Id: user.Id,
            DisplayName: user.DisplayName,
            Email: user.Email,
        };
        const tokenSecret = process.env.TOKEN_SECRET;
        const token = (0, jsonwebtoken_1.sign)({ user: tokenUser }, tokenSecret, { expiresIn: '15m' });
        return res.status(200).cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: true }).json({
            message: 'Auth Passed',
            user: tokenUser,
        });
    })(req, res);
};
exports.log_in = log_in;
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
        res.status(400).json("Error Signing Up");
        return;
    }
    const existingUser = yield prisma.users.findFirst({ where: { Email: req.body.Email } });
    if (existingUser)
        return res.status(400).json({ message: "User Already Exists" });
    (0, bcryptjs_1.hash)(req.body.Password, 10, (err, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.users.create({
            data: {
                Id: (0, uuid_1.v4)(),
                DisplayName: req.body.DisplayName,
                Email: req.body.Email,
                Password: hashedPassword
            }
        });
        return res.status(200).json({ message: "Successfully Created User" });
    }));
});
exports.sign_up = sign_up;
const log_in_facebook = (req, res) => {
    passport_1.default.authenticate('facebook', { session: false }, (err, user) => {
        if (!user) {
            return res.json("No User");
        }
        return res.json(user);
    })(req, res);
};
exports.log_in_facebook = log_in_facebook;
const check_for_token = (req, res) => {
    res.json("Token Here");
};
exports.check_for_token = check_for_token;
