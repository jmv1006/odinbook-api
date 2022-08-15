"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const redis_config_1 = require("./config/redis/redis.config");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: `.env.development` });
const cors_1 = __importDefault(require("cors"));
//import './seeds'
//import FacebookStrategy from './config/passport/facebook';
const local_1 = __importDefault(require("./config/passport/local"));
const jwt_1 = __importDefault(require("./config/passport/jwt"));
const auth_1 = __importDefault(require("./routes/auth"));
const posts_1 = __importDefault(require("./routes/posts"));
const likes_1 = __importDefault(require("./routes/likes"));
const comments_1 = __importDefault(require("./routes/comments"));
const user_1 = __importDefault(require("./routes/user"));
const friend_requests_1 = __importDefault(require("./routes/friend-requests"));
const friendships_1 = __importDefault(require("./routes/friendships"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const options = {
    origin: '*'
};
app.use((0, cors_1.default)(options));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
const redisConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectToRedis)();
});
redisConnect();
passport_1.default.use(local_1.default);
passport_1.default.use(jwt_1.default);
passport_1.default.initialize();
app.get('/', (req, res) => {
    res.json({ message: "Hello From API!" });
});
app.use('/auth', auth_1.default);
app.use('/posts', passport_1.default.authenticate('jwt', { session: false }), posts_1.default);
app.use('/likes', passport_1.default.authenticate('jwt', { session: false }), likes_1.default);
app.use('/comments', passport_1.default.authenticate('jwt', { session: false }), comments_1.default);
app.use('/users', user_1.default);
app.use('/friend-requests', passport_1.default.authenticate('jwt', { session: false }), friend_requests_1.default);
app.use('/friendships', friendships_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map