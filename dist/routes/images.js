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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_config_1 = __importDefault(require("../config/multer/multer-config"));
const check_for_file_1 = __importDefault(require("../middleware/check_for_file"));
const check_user_exists_1 = __importDefault(require("../middleware/check_user_exists"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
router.post('/:UserId/upload', check_user_exists_1.default, multer_config_1.default.single('image'), check_for_file_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    yield prisma.users.update({ where: { Id: req.params.UserId }, data: { ProfileImg: file.location } });
    res.status(200).json({ message: "Upload Successful" });
}));
exports.default = router;
