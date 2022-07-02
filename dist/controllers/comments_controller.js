"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_comment = void 0;
const db_1 = __importDefault(require("../config/db/db"));
const uuid_1 = require("uuid");
const joi_1 = __importDefault(require("joi"));
const create_comment = (req, res) => {
    const schema = joi_1.default.object({
        Text: joi_1.default.string()
            .min(1)
            .max(500)
            .required(),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error)
        return res.status(400).json({ message: "Input Error" });
    db_1.default.query(`SELECT * FROM Users WHERE Id="${req.params.UserId}"`, (err, result) => {
        if (err)
            return res.status(500).json({ message: "Server Error" });
        if (result.length === 0)
            return res.status(400).json({ message: "User Does Not Exist" });
        db_1.default.query(`SELECT * FROM Posts Where Id="${req.params.PostId}"`, (err, result) => {
            if (err)
                return res.status(500).json({ message: "Server Error" });
            if (result.length === 0)
                return res.status(400).json({ message: "Post Does Not Exist" });
            db_1.default.query(`INSERT INTO Comments (Id, Text, User, Post) VALUES ("${(0, uuid_1.v4)()}", "${req.body.text}", "${req.params.UserId}", "${req.params.PostId}")`, (err) => {
                if (err)
                    return res.status(500).json({ message: "Server Error" });
                res.status(200).json({ message: "Successfully Created Comment" });
            });
        });
    });
};
exports.create_comment = create_comment;
