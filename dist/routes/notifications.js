"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const check_user_exists_1 = __importDefault(require("../middleware/auth/check_user_exists"));
const notifications_controller_1 = require("../controllers/notifications_controller");
const check_notification_exists_1 = __importDefault(require("../middleware/auth/check_notification_exists"));
router.get('/:UserId', check_user_exists_1.default, notifications_controller_1.get_user_notifications);
router.delete('/:NotificationId', check_notification_exists_1.default, notifications_controller_1.delete_notification);
exports.default = router;
//# sourceMappingURL=notifications.js.map