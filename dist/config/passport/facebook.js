"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_facebook_1 = require("passport-facebook");
const db_1 = __importDefault(require("../db/db"));
const idString = process.env.FB_CLIENT;
const secretString = process.env.FB_SECRET;
const FacebookStrategy = new passport_facebook_1.Strategy({
    clientID: idString,
    clientSecret: secretString,
    callbackURL: "http://localhost:7000/auth/log-in/facebook"
}, (accessToken, refreshToken, profile, done) => {
    //if cant find user in db, create one!
    db_1.default.query(`SELECT * FROM Users WHERE Id="${profile.id}"`, (err, result) => {
        if (result.length === 0) {
            //no user exists create one
        }
    });
    return done(null, profile);
});
exports.default = FacebookStrategy;
