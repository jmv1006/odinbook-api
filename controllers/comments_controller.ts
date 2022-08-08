import { Request, Response } from "express";
import { v4 } from "uuid";
import Joi from "joi";
import prisma from "../config/prisma/initialize-client";

export const create_comment = async (req: Request, res: Response) => {
    const schema = Joi.object({
        Text: Joi.string()
            .min(1)
            .max(1000)
            .required(),
    });

    const { error } = schema.validate(req.body, {abortEarly: false})

    if(error) return res.status(400).json({message: "Input Error"})
    
    const postExists = await prisma.posts.findUnique({where: {Id: req.params.PostId}})
    if(!postExists) return res.status(400).json({message: "Post Does Not Exist"})

    await prisma.comments.create({
        data: {
            Id: v4(),
            Text: req.body.Text,
            User: req.params.UserId,
            Post: req.params.PostId,
            Date: new Date()
        }
    })

    res.status(200).json({message: "Successfully Created Comment"})
};

export const get_post_comments = async (req: Request, res: Response) => {
    const comments = await prisma.comments.findMany({where: {Post: req.params.PostId}, select: {Id: true, Post: true, Text: true, Date: true, Users: {select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}}}, orderBy: {Date: 'asc'},})

    if(!comments) return res.status(400).json({message: "Error finding comments for post"})

    return res.status(200).json({comments: comments, amount: comments.length})
}

export const delete_comment = async (req: Request, res: Response) => {
    const comment = await prisma.comments.findUnique({where: {Id: req.params.CommentId}});

    if (!comment) return res.status(400).json({message: 'Comment Does Not Exist'})

    await prisma.comments.delete({where: {Id: comment.Id}});

    return res.status(200).json({message: "Comment Successfully Deleted"})
}
