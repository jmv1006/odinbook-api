"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    passport_1.default.authenticate('facebook', { session: false }, (err, user, info) => {
        if (user)
            console.log(user);
        res.json("Test works");
    })(req, res);
});
exports.default = router;
