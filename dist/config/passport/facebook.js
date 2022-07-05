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
const passport_facebook_1 = require("passport-facebook");
const initialize_client_1 = __importDefault(require("../prisma/initialize-client"));
const idString = process.env.FB_CLIENT;
const secretString = process.env.FB_SECRET;
const FacebookStrategy = new passport_facebook_1.Strategy({
    clientID: idString,
    clientSecret: secretString,
    callbackURL: "http://localhost:7000/auth/log-in/facebook",
    profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield initialize_client_1.default.users.findUnique({ where: { Id: profile.id } });
    if (!profile)
        return done(null, false);
    //TODO Create user in DB
    if (!user) {
        //Create a new user
        console.log("No user in DB");
    }
    //IF User
    //return 
    return done(null, profile._json);
}));
exports.default = FacebookStrategy;
