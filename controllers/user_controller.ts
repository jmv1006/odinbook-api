import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';

const prisma = new PrismaClient();

export const get_all_users = async (req: Request, res: Response) => {
    const allUsers = await prisma.users.findMany();
    res.json(allUsers)
};

export const get_specific_user = async (req: Request, res: Response) => {
    const user = await prisma.users.findFirst({where: {Id: req.params.UserId}})
    res.json({user: user})
};

export const get_user_friends = (req: Request, res: Response) => {
    //select from friendships where user1 or user2 equals userId
    res.json("user friends here")
};

export const create_friends = async (req: Request, res: Response) => {
    //If User Ids provided are the same
    if(req.params.User1Id === req.params.User2Id) return res.status(400).json({message: "Cannot Create A Friendship Using Two Of The Same User!"})

    //If frienship already exists
    const friendship = await prisma.friendships.findFirst({where: {OR: [{User1: req.params.User1Id, User2: req.params.User2Id}, {User1: req.params.User2Id, User2: req.params.User1Id}]}});
    if(friendship) return res.status(400).json({message: "Friendship Between Users Already Exists"})

    //check if both users exist
    const user1 = await prisma.users.findFirst({where: {Id: req.params.User1Id}})
    const user2 = await prisma.users.findFirst({where: {Id: req.params.User2Id}})

    if(!user1 || !user2) return res.status(400).json({message: "At least one of the users does not exist"})

    //if they exist, create a friendship between them
    await prisma.friendships.create({
        data: {
            Id: v4(),
            User1: req.params.User1Id,
            User2: req.params.User2Id
        }
    })

    res.status(200).json({message: "Successfully Created Friendship"})
}
