"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_timeline_posts = exports.create_post = exports.get_all_posts = void 0;
const db_1 = __importDefault(require("../config/db/db"));
const joi_1 = __importDefault(require("joi"));
const uuid_1 = require("uuid");
const get_all_posts = (req, res) => {
    db_1.default.query(`SELECT * FROM POSTS`, (err, result) => {
        if (err)
            return res.status(500).json({ message: "Server Error" });
        return res.status(200).json(result);
    });
};
exports.get_all_posts = get_all_posts;
const create_post = (req, res) => {
    const schema = joi_1.default.object({
        Text: joi_1.default.string()
            .min(1)
            .required(),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error)
        return res.status(400).json("Error Creating Post");
    db_1.default.query(`SELECT Id FROM Users WHERE Id="${req.params.UserId}"`, (err, result) => {
        if (err)
            return res.status(500).json({ message: "Server Error" });
        if (result.length === 0)
            return res.status(400).json({ message: "User Does Not Exist" });
        db_1.default.query(`INSERT INTO Posts (Id, UserId, Text) VALUES ("${(0, uuid_1.v4)()}", "${req.params.UserId}", "${req.body.Text}")`, (err) => {
            if (err)
                return res.status(500).json({ message: "Error Creating Post" });
            return res.status(200).json({ message: "Successfully Created Post" });
        });
    });
};
exports.create_post = create_post;
const get_timeline_posts = (req, res) => {
    //Select from friendships
    //Design an algoritm that gets me the users post AND the posts of their friends
    //SELECT from Posts WHERE Id=UserId or Id in()
};
exports.get_timeline_posts = get_timeline_posts;
