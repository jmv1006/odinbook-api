import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';
import Joi from 'joi';
import client from '../config/redis/redis.config';

const prisma = new PrismaClient();

export const get_all_users = async (req: Request, res: Response) => {
    const allUsers = await prisma.users.findMany({select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}});
    res.status(200).json({users: allUsers})
};

export const get_specific_user = async (req: Request, res: Response) => {
    const user = await prisma.users.findFirst({where: {Id: req.params.UserId}, select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}});
    await client.setEx(`/users/${req.params.UserId}`, 3600, JSON.stringify(user));
    res.json({user: user})
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