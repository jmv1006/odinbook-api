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
const aws_config_1 = __importDefault(require("../../config/aws/aws.config"));
const handlePostEdit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //if user wants to delete post image, delete it
    if (req.body.deleteImage === 'true') {
        //delete image and its location in db
        const imgUrl = yield initialize_client_1.default.posts.findFirst({ where: { Id: req.params.PostId } });
        if (!(imgUrl === null || imgUrl === void 0 ? void 0 : imgUrl.Image))
            return next();
        const key = imgUrl === null || imgUrl === void 0 ? void 0 : imgUrl.Image.slice(52);
        const params = { Bucket: 'odinbook-jmv1006', Key: key };
        aws_config_1.default.deleteObject(params, (err, data) => {
            if (err)
                return res.status(500).json({ message: err });
        });
        yield initialize_client_1.default.posts.update({ where: { Id: req.params.PostId }, data: { Image: null } });
    }
    next();
});
exports.default = handlePostEdit;
//# sourceMappingURL=handlePostEdit.js.map