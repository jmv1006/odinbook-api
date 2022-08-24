"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPostImage = exports.uploadProfileImage = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_config_1 = __importDefault(require("../aws/aws.config"));
const path_1 = __importDefault(require("path"));
const uploadProfileImage = (0, multer_1.default)({
    fileFilter(req, file, done) {
        const ext = path_1.default.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return done(null, false);
        }
        done(null, file);
    },
    storage: (0, multer_s3_1.default)({
        s3: aws_config_1.default,
        bucket: 'odinbook-jmv1006',
        key: function (req, file, done) {
            const ext = path_1.default.extname(file.originalname);
            done(null, req.params.UserId + '-profileimg' + ext);
        }
    })
});
exports.uploadProfileImage = uploadProfileImage;
const uploadPostImage = (0, multer_1.default)({
    fileFilter(req, file, done) {
        const ext = path_1.default.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.JPG') {
            return done(null, false);
        }
        done(null, file);
    },
    storage: (0, multer_s3_1.default)({
        s3: aws_config_1.default,
        bucket: 'odinbook-jmv1006',
        key: function (req, file, done) {
            const sanitized = file.originalname.replace(/\s/g, '');
            if (req.params.UserId) {
                const finalKey = req.params.UserId + sanitized;
                return done(null, finalKey);
            }
            else if (req.params.PostId) {
                const finalKey = req.params.PostId + sanitized;
                return done(null, finalKey);
            }
        }
    })
});
exports.uploadPostImage = uploadPostImage;
//# sourceMappingURL=multer-config.js.map