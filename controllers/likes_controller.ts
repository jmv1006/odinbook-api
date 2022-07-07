import { Request, Response } from "express";
import { v4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const get_post_likes = async (req: Request, res: Response) => {
    const likes  = await prisma.post_Likes.findMany({where: {Post: req.params.PostId}});
    res.json({likes: likes, amount: likes.length})
};


export const toggle_post_like = async (req: Request, res: Response) => {
    const postIsLiked = await prisma.post_Likes.findFirst({where: {User: req.params.UserId, Post: req.params.PostId}})
    if(postIsLiked) {
        await prisma.post_Likes.deleteMany({where: {User: req.params.UserId, Post: req.params.PostId}})
        return res.status(200).json({message: "Successfully Removed Like"})
    }

    await prisma.post_Likes.create({
        data: {
            Id: v4(),
            User: req.params.UserId,
            Post: req.params.PostId
        }
    })

    return res.status(200).json({message: "Successfully Created Like"})
};