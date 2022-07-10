import  {Request, Response} from 'express';
import { v4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const get_all_requests = async (req: Request, res: Response) => {
    const requests = await prisma.friend_requests.findMany()
    res.status(200).json({requests: requests})
}

export const create_request = async (req: Request, res: Response) => {
    if(req.params.From_Id === req.params.To_Id) return res.status(400).json({message: "Cannot create a friend request between two of the same user"})
    
    const user1Exists = await prisma.users.findUnique({where:{Id:req.params.From_Id}})
    const user2Exists = await prisma.users.findUnique({where: {Id: req.params.To_Id}})

    if(!user1Exists || !user2Exists) return res.status(400).json({message: "At least one of the users does not exist"})

    const existingRequest = await prisma.friend_requests.findFirst({where: {OR: [{From_uuid: req.params.From_Id, To_uuid: req.params.To_Id}, {From_uuid: req.params.To_Id, To_uuid: req.params.From_Id}]}})
    if(existingRequest) return res.status(400).json({message: "Request between user already exists"})

    await prisma.friend_requests.create({
        data: {
            Id: v4(),
            From_uuid: req.params.From_Id,
            To_uuid: req.params.To_Id,
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


export const check_request_exists = async (req: Request, res: Response) => {
    const request = await prisma.friend_requests.findFirst({where: {OR: [{From_uuid: req.params.User1Id, To_uuid: req.params.User2Id}, {From_uuid: req.params.User2Id, To_uuid: req.params.User1Id}]}})
    if(request) return res.status(200).json({exists: true})
    return res.status(200).json({exists: false})
}