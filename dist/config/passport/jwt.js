"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const passport_jwt_2 = require("passport-jwt");
const db_1 = __importDefault(require("../db/db"));
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};
const opts = {
    jwtFromRequest: passport_jwt_2.ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.TOKEN_SECRET
};
const strategy = new passport_jwt_1.Strategy(opts, (payload, done) => {
    console.log(payload);
    db_1.default.query(`SELECT * FROM Users WHERE Id="${payload.user.Id}"`, (err, result) => {
        if (err) {
            //error connecting to db
        }
        if (!result) {
            return done(null, false);
        }
        return done(null, result[0]);
    });
});
exports.default = strategy;
