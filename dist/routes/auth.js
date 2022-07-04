"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("../controllers/auth_controller");
const router = express_1.default.Router();
router.post('/log-in', auth_controller_1.log_in);
router.post('/sign-up', auth_controller_1.sign_up);
router.get('/log-in/facebook', auth_controller_1.log_in_facebook);
router.get('/token', passport_1.default.authenticate('jwt'), auth_controller_1.check_for_token);
exports.default = router;
