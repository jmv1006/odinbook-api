import { Request, Response } from "express";
import Joi from "joi";
import { v4 } from "uuid";
import prisma from "../config/prisma/initialize-client";

export const get_all_posts = async (req: Request, res: Response) => {
    const posts = await prisma.posts.findMany({orderBy: {Date: 'desc'}, select: {Id: true, Text: true, Date: true, Users: {select: {Id: true, DisplayName: true, Email: true}}} });
    if(!posts) return res.status(400).json({message: "No Posts!"})
    return res.status(200).json({posts:posts})
};

export const get_user_posts = async (req: Request, res: Response) => {
    const posts = await prisma.posts.findMany({where: {UserId: req.params.UserId}, select: {Id: true, Text: true, Date: true, Users: {select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}}}, orderBy: {Date: 'desc'}});
    return res.status(200).json({posts: posts})
};

export const create_post = async (req: Request, res: Response) => {
    const schema = Joi.object({
        Text: Joi.string()
            .min(1)
            .required(),
    });

    const { error } = schema.validate(req.body, {abortEarly: false})

    if(error) return res.status(400).json("Error Creating Post")

    await prisma.posts.create({
        data: {
            Id: v4(),
            UserId: req.params.UserId,
            Text: req.body.Text,
            Date: new Date()
        }
    });

    return res.status(200).json({message: "Successfully Created Post"})
};

export const get_timeline_posts = async (req: Request, res: Response) => {

    //finds frienships where user is a member
    const friendships = await prisma.friendships.findMany({where: {OR: [{User1: req.params.UserId}, {User2: req.params.UserId}]}})

    //filters out Ids of friends and into an array
    const friendsIds: Array<any>  = friendships.map(friendship => friendship.User1 === req.params.UserId ? friendship.User2 : friendship.User1)

    const postsI = await prisma.posts.findMany({where: {OR: [{UserId: req.params.UserId}, {UserId: {in: friendsIds}}]}, select: {Id: true, Text: true, Date: true, Users: {select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}}}, orderBy: {Date: 'desc'}});
    res.status(200).json({posts: postsI})
}
