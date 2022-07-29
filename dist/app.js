"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
require("./config/redis/redis.config");
const cors_1 = __importDefault(require("cors"));
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
passport_1.default.use(local_1.default);
passport_1.default.use(jwt_1.default);
passport_1.default.initialize();
app.use('/auth', auth_1.default);
app.use('/posts', passport_1.default.authenticate('jwt', { session: false }), posts_1.default);
app.use('/likes', passport_1.default.authenticate('jwt', { session: false }), likes_1.default);
app.use('/comments', passport_1.default.authenticate('jwt', { session: false }), comments_1.default);
app.use('/users', passport_1.default.authenticate('jwt', { session: false }), user_1.default);
app.use('/friend-requests', passport_1.default.authenticate('jwt', { session: false }), friend_requests_1.default);
app.use('/friendships', passport_1.default.authenticate('jwt', { session: false }), friendships_1.default);
app.get('/', (req, res) => {
    res.json({ message: "Hello From API!" });
});
exports.default = app;
