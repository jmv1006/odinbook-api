"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const posts_1 = __importDefault(require("../../routes/posts"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/posts', posts_1.default);
test("user posts works", done => {
    (0, supertest_1.default)(app)
        .get('/posts/ff89861a-552a-496c-9a30-efc3eb79d300')
        .expect("Content-Type", /json/)
        .expect(200, done);
});
test("user timeline posts works", done => {
    (0, supertest_1.default)(app)
        .get('/posts/ff89861a-552a-496c-9a30-efc3eb79d300/timeline')
        .expect("Content-Type", /json/)
        .expect(200, done);
});
test("returns error for unknown user", done => {
    (0, supertest_1.default)(app)
        .get('/posts/123')
        .expect(400, done);
});
