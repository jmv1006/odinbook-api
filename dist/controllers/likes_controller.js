"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove_post_like = exports.create_post_like = void 0;
const db_1 = __importDefault(require("../config/db/db"));
const uuid_1 = require("uuid");
//Create Like
const create_post_like = (req, res) => {
    db_1.default.query(`SELECT * FROM Post_Likes WHERE User="${req.params.UserId}" AND Post="${req.params.PostId}"`, (err, result) => {
        if (err)
            return res.status(500).json({ message: "Server Error" });
        if (result.length > 0)
            return res.status(400).json({ message: "Post Is Already Liked By User" });
        db_1.default.query(`SELECT Id FROM Posts WHERE Id="${req.params.PostId}"`, (err, result) => {
            if (err)
                return res.status(500).json({ message: "Server Error" });
            if (result.length === 0)
                return res.status(400).json({ message: "Post Does Not Exist" });
            db_1.default.query(`INSERT INTO Post_Likes (Id, User, Post) VALUES ("${(0, uuid_1.v4)()})", "${req.params.UserId}", "${req.params.PostId}")`, (err) => {
                if (err)
                    return res.status(500).json({ message: "Server Error" });
                return res.status(200).json({ message: "Successfully Created Like" });
            });
        });
    });
};
exports.create_post_like = create_post_like;
const remove_post_like = (req, res) => {
    db_1.default.query(`DELETE FROM Post_Likes WHERE Post="${req.params.PostId}" AND User="${req.params.UserId}"`, (err) => {
        if (err)
            return res.status(500).json({ message: "Error Removing Like From DB" });
        res.status(200).json({ message: "Successfully Removed Like" });
    });
};
exports.remove_post_like = remove_post_like;
