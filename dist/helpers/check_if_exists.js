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
exports.check_if_user_exists = void 0;
const db_1 = __importDefault(require("../config/db/db"));
const check_if_user_exists = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    db_1.default.query(`SELECT Id FROM Users WHERE Id="${userId}"`, (err, result) => {
        if (result.length > 0)
            return true;
        return false;
    });
});
exports.check_if_user_exists = check_if_user_exists;
