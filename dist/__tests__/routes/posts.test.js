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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const posts_1 = __importDefault(require("../../routes/posts"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: `.env.test` });
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
test("attempt to delete post that does not exist is blocked", done => {
    (0, supertest_1.default)(app)
        .delete('/posts/1234')
        .expect(400, done);
});
test("post with invalid input field is rejected", done => {
    (0, supertest_1.default)(app)
        .post('/posts/ff89861a-552a-496c-9a30-efc3eb79d300')
        .type("form")
        .send({ randomField: 1234 })
        .expect(400, done);
});
test("post with no text is rejected", done => {
    (0, supertest_1.default)(app)
        .post('/posts/ff89861a-552a-496c-9a30-efc3eb79d300')
        .type("form")
        .send({ Text: "" })
        .expect(400, done);
});
test("updates post successfully", done => {
    (0, supertest_1.default)(app)
        .put('/posts/3dd26bf6-267b-48be-9fe7-236f6e775295')
        .type("form")
        .send({ Text: "UPDATED IN TEST", deleteImage: "false" })
        .expect(200, done);
});
//# sourceMappingURL=posts.test.js.map