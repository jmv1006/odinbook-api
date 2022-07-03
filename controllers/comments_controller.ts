import { Request, Response } from "express";
import { v4 } from "uuid";
import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const create_comment = async (req: Request, res: Response) => {
    const schema = Joi.object({
        Text: Joi.string()
            .min(1)
            .max(500)
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
            Post: req.params.PostId
        }
    })

    res.status(200).json({message: "Successfully Created Comment"})
};

