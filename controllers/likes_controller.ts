import { Request, Response } from "express";
import { v4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const create_post_like = async (req: Request, res: Response) => {
    const postIsLiked = await prisma.post_Likes.findFirst({where: {User: req.params.UserId, Post: req.params.PostId}})
    if(postIsLiked) return res.status(400).json({message: "Post Is Already Liked"})

    await prisma.post_Likes.create({
        data: {
            Id: v4(),
            User: req.params.UserId,
            Post: req.params.PostId
        }
    })

    return res.status(200).json({message: "Successfully Created Like"})
};

export const remove_post_like = async (req: Request, res: Response) => {
    await prisma.post_Likes.deleteMany({where: {User: req.params.UserId, Post: req.params.PostId}})
    res.status(200).json({message: "Successfully Removed Like"})
};

export const get_post_likes = async (req: Request, res: Response) => {
    const likes  = await prisma.post_Likes.findMany();
    res.json({likes: likes, amount: likes.length})
};