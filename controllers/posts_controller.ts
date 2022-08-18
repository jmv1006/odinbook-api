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
    const posts = await prisma.posts.findMany({where: {UserId: req.params.UserId}, select: {Id: true, Text: true, Image: true, Date: true, Users: {select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}}}, orderBy: {Date: 'desc'}});
    return res.status(200).json({posts: posts})
};

export const create_post = async (req: Request, res: Response) => {
    const file: any = req.file

    const schema = Joi.object({
        Text: Joi.string()
            .min(1)
            .max(5000)
            .required()
    });

    const { error } = schema.validate(req.body, {abortEarly: false})

    if(error) return res.status(400).json("Error Creating Post")

    const newPost = await prisma.posts.create({
        data: {
            Id: v4(),
            UserId: req.params.UserId,
            Text: req.body.Text,
            Date: new Date(),
            Image: file ? file.location : null
        }
    });


    const returnedPost = await prisma.posts.findUnique({where: {Id: newPost.Id}, select: {Id: true, Text: true, Image: true, Date: true, Users: {select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}}}});

    return res.status(200).json({createdPost: returnedPost})
};

export const get_timeline_posts = async (req: Request, res: Response) => {

    //finds frienships where user is a member
    const friendships = await prisma.friendships.findMany({where: {OR: [{User1: req.params.UserId}, {User2: req.params.UserId}]}})

    //filters out Ids of friends and into an array
    const friendsIds: Array<any>  = friendships.map(friendship => friendship.User1 === req.params.UserId ? friendship.User2 : friendship.User1)

    const postsI = await prisma.posts.findMany({where: {OR: [{UserId: req.params.UserId}, {UserId: {in: friendsIds}}]}, select: {Id: true, Text: true, Date: true, Image: true, Users: {select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}}}, orderBy: {Date: 'desc'}});
    res.status(200).json({posts: postsI})
};

export const delete_post = async (req: Request, res: Response) => {
    const deleted = await prisma.posts.delete({where: {Id: req.params.PostId}})
    return res.status(200).json({deletedPost: deleted})
};

export const edit_post = async (req: Request, res: Response) => {
    const file: any = req.file;

    const schema = Joi.object({
        Text: Joi.string()
            .min(1)
            .max(5000)
            .required(),
        deleteImage: Joi.string()
            .min(1)
            .max(10)
            .required()
    });

    const { error } = schema.validate(req.body, {abortEarly: false})

    if(error) return res.status(400).json({message: "Error Editing Post"});

    try {
        let updatedPost;
        if(file) updatedPost = await prisma.posts.update({where: {Id: req.params.PostId}, data: {Text: req.body.Text, Image: file.location}})
        else updatedPost = await prisma.posts.update({where: {Id: req.params.PostId}, data: {Text: req.body.Text}});
        
        const returnedPost = await prisma.posts.findUnique({where: {Id: updatedPost.Id}, select: {Id: true, Text: true, Date: true, Image: true, Users: {select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}}}});
        return res.status(200).json({updatedPost: returnedPost});
    } catch(error: any) {
        return res.status(500).json({message: "Error Updating Post"})
    }
};

export const get_pagninated_posts = async (req: Request, res: Response) => {
    if(!req.query.page || !req.query.limit) return res.status(400).json({message: 'Invalid Query'})

    const page: number = parseInt(req.query.page as string)
    const limit: number = parseInt(req.query.limit as string)

    const endIndex = page * limit;

    try {
        //finds frienships where user is a member
        const friendships = await prisma.friendships.findMany({where: {OR: [{User1: req.params.UserId}, {User2: req.params.UserId}]}})

        //filters out Ids of friends and into an array
        const friendsIds: Array<any> = friendships.map(friendship => friendship.User1 === req.params.UserId ? friendship.User2 : friendship.User1)

        const posts = await prisma.posts.findMany({take: limit, skip: endIndex, where: {OR: [{UserId: req.params.UserId}, {UserId: {in: friendsIds}}]}, select: {Id: true, Text: true, Image: true, Date: true, Users: {select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}}}, orderBy: {Date: 'desc'}});

        res.status(200).json({posts: posts, total: posts.length})

    } catch(error: any) {
        return res.status(500).json({message: "Server Error"})
    }
};
