"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign_up = exports.log_in = void 0;
const db_1 = __importDefault(require("../config/db/db"));
const joi_1 = __importDefault(require("joi"));
const uuid_1 = require("uuid");
const bcryptjs_1 = require("bcryptjs");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = require("jsonwebtoken");
const log_in = (req, res) => {
    passport_1.default.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(400).json('Error Authenticating User');
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
const sign_up = (req, res) => {
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
    ;
    db_1.default.query(`SELECT * FROM Users WHERE Email="${req.body.Email}"`, (err, result) => {
        if (result.length > 0)
            return res.status(400).json({ message: "User Already Exists" });
        (0, bcryptjs_1.hash)(req.body.Password, 10, (err, hashedPassword) => {
            db_1.default.query(`INSERT INTO Users (Id, DisplayName, Email, Password) VALUES ("${(0, uuid_1.v4)()}", "${req.body.DisplayName}", "${req.body.Email}", "${hashedPassword}")`, (err, result) => {
                if (err)
                    return res.status(500).json({ message: "Server Error" });
                return res.status(200).json({ message: "Successfully Created User" });
            });
        });
    });
};
exports.sign_up = sign_up;
