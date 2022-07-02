"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require("dotenv/config");
require("./config/db/db");
const facebook_1 = __importDefault(require("./config/passport/facebook"));
const local_1 = __importDefault(require("./config/passport/local"));
const jwt_1 = __importDefault(require("./config/passport/jwt"));
const auth_1 = __importDefault(require("./routes/auth"));
const posts_1 = __importDefault(require("./routes/posts"));
const likes_1 = __importDefault(require("./routes/likes"));
const comments_1 = __importDefault(require("./routes/comments"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
passport_1.default.use(facebook_1.default);
passport_1.default.use(local_1.default);
passport_1.default.use(jwt_1.default);
passport_1.default.initialize();
app.use('/auth', auth_1.default);
app.use('/posts', passport_1.default.authenticate('jwt'), posts_1.default);
app.use('/likes', passport_1.default.authenticate('jwt'), likes_1.default);
app.use('/comments', passport_1.default.authenticate('jwt'), comments_1.default);
app.get('/', (req, res) => {
    res.json("Hello From API!");
});
const port = 7000;
app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
});
