"use strict";
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
const faker_1 = require("@faker-js/faker");
const initialize_client_1 = __importDefault(require("./config/prisma/initialize-client"));
const uuid_1 = require("uuid");
const randomName = faker_1.faker.name.findName(); // Rowan Nikolaus
const password = faker_1.faker.word.noun();
const email = faker_1.faker.word.noun() + faker_1.faker.word.adjective() + "@gmail.com";
const fakeUsers = [];
for (let i = 0; i < 100; i++) {
    const randomName = faker_1.faker.name.findName(); // Rowan Nikolaus
    const password = faker_1.faker.word.noun() + faker_1.faker.word.adjective();
    const email = faker_1.faker.word.noun() + faker_1.faker.word.adjective() + "@gmail.com";
    const fakeUser = {
        Email: email,
        DisplayName: randomName,
        Password: password
    };
    fakeUsers.push(fakeUser);
}
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield initialize_client_1.default.users.create({
        data: {
            Id: (0, uuid_1.v4)(),
            DisplayName: user.DisplayName,
            Email: user.Email,
            ProfileImg: "https://i.stack.imgur.com/l60Hf.png",
            Password: user.Password
        }
    });
    yield initialize_client_1.default.profile_Info.create({
        data: {
            Id: (0, uuid_1.v4)(),
            UserId: createdUser.Id,
            Bio: ""
        }
    });
});
fakeUsers.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
    //createUser(user)
}));
console.log('done');
