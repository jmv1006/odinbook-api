"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_facebook_1 = require("passport-facebook");
const FacebookStrategy = new passport_facebook_1.Strategy({
    clientID: "sda",
    clientSecret: "dsadsa",
    callbackURL: "dsadas"
}, function () {
    //db ops
});
exports.default = FacebookStrategy;
