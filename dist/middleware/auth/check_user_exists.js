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
const initialize_client_1 = __importDefault(require("../../config/prisma/initialize-client"));
const checkUserExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield initialize_client_1.default.users.findUnique({ where: { Id: req.params.UserId } });
    if (!userExists)
        return res.status(400).json({ message: "User Does Not Exist" });
    next();
});
exports.default = checkUserExists;
//# sourceMappingURL=check_user_exists.js.map