import  {Request, Response} from 'express';
import { v4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const get_all_requests = async (req: Request, res: Response) => {
    const requests = await prisma.friend_requests.findMany()
    res.status(200).json({requests: requests})
}

export const create_request = async (req: Request, res: Response) => {
    if(req.params.User1Id === req.params.User2Id) return res.status(400).json({message: "Cannot create a friend request between two of the same user"})
    
    const user1Exists = await prisma.users.findUnique({where:{Id:req.params.User1Id}})
    const user2Exists = await prisma.users.findUnique({where: {Id: req.params.User2Id}})

    if(!user1Exists || !user2Exists) return res.status(400).json({message: "At least one of the users does not exist"})

    const existingRequest = await prisma.friend_requests.findFirst({where: {OR: [{User1: req.params.User1, User2: req.params.User2}, {User1: req.params.User2, User2: req.params.User1}]}})
    if(existingRequest) return res.status(400).json({message: "Request between user already exists"})

    await prisma.friend_requests.create({
        data: {
            Id: v4(),
            User1: req.params.User1Id,
            User2: req.params.User2Id
        }
    });

    res.status(200).json({message: "Successfully Created Friend Request"})
};

export const delete_request = async (req: Request, res: Response) => {
    const requestExists = await prisma.friend_requests.findUnique({where: {Id: req.params.RequestId}})
    if(!requestExists) return res.status(400).json({message: "Friend Request Does Not Exist"})
    
    await prisma.friend_requests.delete({
        where:{
            Id: req.params.RequestId
        }
    })
    
    res.status(200).json({message: "Successfully Deleted Request"})
}

//TO-DO: Get User Requests
