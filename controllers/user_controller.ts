import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';
import Joi from 'joi';
import client from '../config/redis/redis.config';

const prisma = new PrismaClient();

export const get_all_users = async (req: Request, res: Response) => {
    const allUsers = await prisma.users.findMany({select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}});
    res.status(200).json(allUsers)
};

export const get_specific_user = async (req: Request, res: Response) => {
    const user = await prisma.users.findFirst({where: {Id: req.params.UserId}, select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}});
    await client.setEx(`/users/${req.params.UserId}`, 3600, JSON.stringify(user));
    res.json({user: user})
};

export const get_user_friends = async (req: Request, res: Response) => {

    //finds frienships where user is a member
    const friendships = await prisma.friendships.findMany({where: {OR: [{User1: req.params.UserId}, {User2: req.params.UserId}]}})

    //filters out Ids of friends and into an array
    const friendsIds: Array<any>  = friendships.map(friendship => friendship.User1 === req.params.UserId ? friendship.User2 : friendship.User1)

    //finds friends
    const friends = await prisma.users.findMany({where: {Id: {in: friendsIds}}, select:{Id: true, DisplayName: true, Email: true}})

    //adding users friendlist to cache
    await client.setEx(`/friends/${req.params.UserId}`, 3600, JSON.stringify(friends));

    res.json({friends: friends})
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
};

export const edit_user_details = async (req: Request, res: Response) => {
    const schema = Joi.object({
        Email: Joi.string()
            .email()
            .min(3),
        DisplayName: Joi.string()
            .min(3)
    });

    const { error } = schema.validate(req.body, {abortEarly: false});

    if(error) return res.status(400).json({message: "error updating user details"})
    
    await prisma.users.update({
        where: {
            Id: req.params.UserId
        },
        data: {
            Email: req.body.Email,
            DisplayName: req.body.DisplayName
        }
    });

    //deleting existing user details from cache, if they exist
    await client.del(`/users/${req.params.UserId}`)

    res.status(200).json({message: "Successfully Updated User"})
};

export const handleProfileImg = async (req: Request, res: Response) => {
    if(!req.file) return res.status(400).json({message: 'No File Sent In Request'});
    
    const file: any = req.file;
    await prisma.users.update({where: {Id: req.params.UserId}, data: {ProfileImg: file.location}});
    
    return res.status(200).json({message: 'File Successfully Uploaded'})
};

export const profileImgDelete = async (req: Request, res: Response) => {
    await prisma.users.update({where: {Id: req.params.UserId}, data: {ProfileImg: null}})
    return res.status(200).json({message: 'Image Successfully Deleted'})
};