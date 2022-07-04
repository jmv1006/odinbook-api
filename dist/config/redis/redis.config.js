"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
});
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();
client.on('connect', () => console.log("Successfully Connected To Redis"));
exports.default = client;
