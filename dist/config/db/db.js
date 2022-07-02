"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const config_1 = require("./config");
const con = mysql_1.default.createConnection({
    host: config_1.DBConfig.host,
    port: config_1.DBConfig.port,
    user: config_1.DBConfig.user,
    password: config_1.DBConfig.password,
    database: config_1.DBConfig.database
});
con.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Successfully Connected to DB');
});
exports.default = con;
