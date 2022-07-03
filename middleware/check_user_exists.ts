import {Request, Response, NextFunction} from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const checkUserExists = async (req: Request, res: Response, next: NextFunction) => {
    const userExists = await prisma.users.findUnique({where: {Id: req.params.UserId}});
    if(!userExists) return res.status(400).json({message: "User Does Not Exist"})
    next()
};

export default checkUserExists