"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConfig = void 0;
exports.DBConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};
