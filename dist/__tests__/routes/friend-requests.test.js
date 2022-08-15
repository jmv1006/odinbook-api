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
const friend_requests_1 = __importDefault(require("../../routes/friend-requests"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: `.env.test` });
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/friend-requests', friend_requests_1.default);
const testUserId = "ff89861a-552a-496c-9a30-efc3eb79d300";
test("get all friend requests that involve user", done => {
    (0, supertest_1.default)(app)
        .get(`/friend-requests/${testUserId}`)
        .expect("Content-Type", /json/)
        .expect(200, done);
});
test("get all friend requests that user sent", done => {
    (0, supertest_1.default)(app)
        .get(`/friend-requests/sent/${testUserId}`)
        .expect("Content-Type", /json/)
        .expect(200, done);
});
test("get all friend requests that user recieved", done => {
    (0, supertest_1.default)(app)
        .get(`/friend-requests/recieved/${testUserId}`)
        .expect("Content-Type", /json/)
        .expect(200, done);
});
test("friend requests between users does not exist", done => {
    (0, supertest_1.default)(app)
        .get(`/friend-requests/${testUserId}/1234`)
        .expect("Content-Type", /json/)
        .expect({ exists: false })
        .expect(200, done);
});
//# sourceMappingURL=friend-requests.test.js.map