import  {Request, Response} from 'express';
import { v4 } from 'uuid';
import prisma from '../config/prisma/initialize-client';

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

    const request = await prisma.friend_requests.create({
        data: {
            Id: v4(),
            From_uuid: req.params.From_Id,
            To_uuid: req.params.To_Id,
            Is_Accepted: false
        }
    });

    res.status(200).json({request: request})
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
};


export const check_request_exists = async (req: Request, res: Response) => {
    const request = await prisma.friend_requests.findFirst({where: {OR: [{From_uuid: req.params.From_Id, To_uuid: req.params.To_Id}, {From_uuid: req.params.To_Id, To_uuid: req.params.From_Id}]}})
    if(request) return res.status(200).json({exists: true, request: request})
    return res.status(200).json({exists: false})
};

export const get_user_recieved_requests = async (req: Request, res: Response) => {
    const requests = await prisma.friend_requests.findMany({where: {To_uuid: req.params.UserId}, include: {Users_UsersTofriend_requests_From_uuid: {select: {Id: true, Email: true, ProfileImg: true, DisplayName: true}}}})
    return res.status(200).json({requests: requests})
};


export const get_user_sent_requests = async (req: Request, res: Response) => {
    const requests = await prisma.friend_requests.findMany({where: {From_uuid: req.params.UserId}, include: {Users_UsersTofriend_requests_To_uuid: {select: {Id: true, Email: true, ProfileImg: true, DisplayName: true}}}})
    return res.status(200).json({requests: requests})
};

export const get_all_user_requests = async (req: Request, res: Response) => {
    const requests = await prisma.friend_requests.findMany({where: {OR: [{To_uuid: req.params.UserId}, {From_uuid: req.params.UserId}]}})
    return res.status(200).json({requests: requests})
};