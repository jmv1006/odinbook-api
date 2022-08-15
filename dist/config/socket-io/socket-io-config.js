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
const server_1 = require("../../server");
const initialize_client_1 = __importDefault(require("../prisma/initialize-client"));
server_1.io.on('connection', (socket) => {
    let user = "";
    socket.on('user-identify', (userId) => {
        user = userId;
        socket.join(user);
    });
    socket.on('event', (event, userId) => {
        if (user === userId)
            return console.log('Same User');
        //io.to(user).emit("event", event)
    });
    //TO-DO: When a user creates a post, the news feed of their friends page should reflect it...
    socket.on('post', (userId) => __awaiter(void 0, void 0, void 0, function* () {
        //Alert all amigos
        const friendships = yield initialize_client_1.default.friendships.findMany({ where: { OR: [{ User1: userId }, { User2: userId }] } });
        const friendsIds = friendships.map(friendship => friendship.User1 === userId ? friendship.User2 : friendship.User1);
        friendsIds.forEach((room) => {
            server_1.io.sockets.in(room).emit('new-post');
        });
    }));
    socket.on('notification', (userId, type, entityId) => __awaiter(void 0, void 0, void 0, function* () {
        //when a notification is triggered, send it to the target User Id with the type
        server_1.io.sockets.in(userId).emit('notification', { type: type, entityId: entityId });
    }));
});
//# sourceMappingURL=socket-io-config.js.map