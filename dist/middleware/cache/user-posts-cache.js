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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_config_1 = require("../../config/redis/redis.config");
const client = (0, redis_config_1.getClient)();
const checkUserPostsCache = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield client.get(`/posts/${req.params.UserId}`);
    if (!posts) {
        return next();
    }
    return res.status(200).json({ posts: JSON.parse(posts) });
});
exports.default = checkUserPostsCache;
//# sourceMappingURL=user-posts-cache.js.map