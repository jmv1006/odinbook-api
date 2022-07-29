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
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const bcryptjs_1 = require("bcryptjs");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const LocalStrategy = new passport_local_1.Strategy({ usernameField: "Email", passwordField: "Password" }, (Email, Password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.findFirst({ where: { Email: Email } });
    if (!user)
        return done(null, false, { message: "User Not Found" });
    if (user) {
        (0, bcryptjs_1.compare)(Password, user.Password, (err, res) => {
            if (res) {
                return done(null, user);
            }
            return done(null, false, { message: "Incorrect Password" });
        });
    }
}));
exports.default = LocalStrategy;
