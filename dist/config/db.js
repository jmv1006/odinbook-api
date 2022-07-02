"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const con = mysql_1.default.createConnection();
con.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Successfully Connected to DB');
});
module.exports = con;
