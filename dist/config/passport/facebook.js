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
const passport_facebook_1 = require("passport-facebook");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const idString = process.env.FB_CLIENT;
const secretString = process.env.FB_SECRET;
const FacebookStrategy = new passport_facebook_1.Strategy({
    clientID: idString,
    clientSecret: secretString,
    callbackURL: "http://localhost:7000/auth/log-in/facebook"
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.findUnique({ where: { Id: profile.id } });
    if (!user) //TO-DO: Create User In DB
        return done(null, profile);
}));
exports.default = FacebookStrategy;
