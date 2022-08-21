import {Request, Response, NextFunction} from 'express'
import prisma from '../../config/prisma/initialize-client';

const checkNotificationExists = async (req: Request, res: Response, next: NextFunction) => {
    const notificationExists = await prisma.notifications.findUnique({where: {Id: req.params.NotificationId}})
    if(!notificationExists) return res.status(400).json({message: "Notification Does Not Exist"})
    next()
};

export default checkNotificationExists;