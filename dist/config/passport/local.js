"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const bcryptjs_1 = require("bcryptjs");
const db_1 = __importDefault(require("../db/db"));
const LocalStrategy = new passport_local_1.Strategy({ usernameField: "Email", passwordField: "Password" }, (Email, Password, done) => {
    db_1.default.query(`SELECT * FROM Users WHERE Email="${Email}"`, (err, result) => {
        if (err) {
            return done(err);
        }
        if (result.length == 0) {
            return done(null, false, { message: "Incorrect Username" });
        }
        if (result.length > 0) {
            (0, bcryptjs_1.compare)(Password, result[0].Password, (err, res) => {
                if (res) {
                    return done(null, result[0]);
                }
                return done(null, false, { message: "Incorrect Password" });
            });
        }
    });
});
exports.default = LocalStrategy;
