"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_facebook_1 = require("passport-facebook");
const idString = process.env.FB_CLIENT;
const secretString = process.env.FB_SECRET;
const FacebookStrategy = new passport_facebook_1.Strategy({
    clientID: idString,
    clientSecret: secretString,
    callbackURL: "http://localhost:7000/test"
}, (accessToken, refreshToken, profile, done) => {
    //if cant find user in db, create one!
    return done(null, profile);
});
exports.default = FacebookStrategy;
