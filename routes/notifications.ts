import express from "express";
const router = express.Router();
import checkUserExists from '../middleware/auth/check_user_exists';
import {get_user_notifications, delete_notification} from '../controllers/notifications_controller';
import check_notification_exists from '../middleware/auth/check_notification_exists';

router.get('/:UserId', checkUserExists, get_user_notifications)

router.delete('/:NotificationId', check_notification_exists, delete_notification);

export default router;