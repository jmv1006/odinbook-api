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
exports.delete_notification = exports.get_user_notifications = void 0;
const initialize_client_1 = __importDefault(require("../config/prisma/initialize-client"));
const get_user_notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield initialize_client_1.default.notifications.findMany({ where: { To_User: req.params.UserId }, select: { Id: true, Post_Id: true, Notification_Type: true, Users_Notifications_From_UserToUsers: { select: { Id: true, DisplayName: true, ProfileImg: true, Email: true } } } });
    notifications.forEach((notification) => {
        const field = notification.Users_Notifications_From_UserToUsers;
        notification.User = field;
        delete notification['Users_Notifications_From_UserToUsers'];
    });
    return res.status(200).json({ notifications: notifications });
});
exports.get_user_notifications = get_user_notifications;
const delete_notification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield initialize_client_1.default.notifications.delete({ where: { Id: req.params.NotificationId } });
    return res.status(200).json({ deletedNotification: notification });
});
exports.delete_notification = delete_notification;
//# sourceMappingURL=notifications_controller.js.map