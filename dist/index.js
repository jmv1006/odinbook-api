"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
require("dotenv/config");
const facebook_1 = __importDefault(require("./config/passport/facebook"));
const local_1 = __importDefault(require("./config/passport/local"));
const express_1 = __importDefault(require("express"));
const test_1 = __importDefault(require("./routes/test"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
passport_1.default.use(facebook_1.default);
passport_1.default.use(local_1.default);
passport_1.default.initialize();
app.use('/test', test_1.default);
app.get('/', (req, res) => {
    res.json("Hello From API!");
});
const port = 7000;
app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
});
