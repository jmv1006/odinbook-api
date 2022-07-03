import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const get_all_users = async (req: Request, res: Response) => {
    const allUsers = await prisma.users.findMany();
    res.json(allUsers)
};

export const get_specific_user = async (req: Request, res: Response) => {
    const user = await prisma.users.findFirst({where: {Id: req.params.UserId}})
    if(user === null) return res.status(400).json({message: "User Does Not Exist"})
    res.json(user)
};

export const get_user_friends = (req: Request, res: Response) => {
    //select from friendships where user1 or user2 equals userId
    res.json("user friends here")
};

export const create_friends = async (req: Request, res: Response) => {
    //check if both users exist
    res.json("Post friends here")
}
