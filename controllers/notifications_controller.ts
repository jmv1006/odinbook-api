import { Request, Response } from "express";
import prisma from "../config/prisma/initialize-client";

export const get_user_notifications = async (req: Request, res: Response) => {
    const notifications = await prisma.notifications.findMany({where: {To_User: req.params.UserId}, select: {Id: true, Post_Id: true, Notification_Type: true, Users_Notifications_From_UserToUsers: {select: {Id: true, DisplayName: true, ProfileImg: true, Email: true}}}});

    notifications.forEach((notification: any) => {
        const field = notification.Users_Notifications_From_UserToUsers
        notification.User = field
        delete notification['Users_Notifications_From_UserToUsers']
    });

    return res.status(200).json({notifications: notifications})
}

export const delete_notification = async (req: Request, res: Response) => {
    const notification = await prisma.notifications.delete({where: {Id: req.params.NotificationId}})
    return res.status(200).json({deletedNotification: notification})
}