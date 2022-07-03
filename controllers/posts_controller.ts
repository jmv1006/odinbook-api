import { Request, Response } from "express";
import Joi from "joi";
import { v4 } from "uuid";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const get_all_posts = async (req: Request, res: Response) => {
    const posts = await prisma.posts.findMany();
    if(!posts) return res.status(400).json({message: "No Posts!"})
    return res.status(200).json(posts)
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
            Text: req.body.Text
        }
    });

    return res.status(200).json({message: "Successfully Created Post"})
};

export const get_timeline_posts = (req: Request, res: Response) => {

    //Select from friendships
    
    //Design an algoritm that gets me the users post AND the posts of their friends
    //SELECT from Posts WHERE Id=UserId or Id in()
}
