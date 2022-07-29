import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import client from '../config/redis/redis.config';

const prisma = new PrismaClient();

export const get_all_users = async (req: Request, res: Response) => {
    const allUsers = await prisma.users.findMany({select: {Id: true, DisplayName: true, ProfileImg: true}});
    await client.setEx(`/users/all`, 500, JSON.stringify(allUsers));
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
    
    const updatedUser = await prisma.users.update({
        where: {
            Id: req.params.UserId
        },
        data: {
            Email: req.body.Email,
            DisplayName: req.body.DisplayName
        },
        select: {
            Id: true,
            DisplayName: true,
            Email: true,
            ProfileImg: true
        }
    });

    //deleting existing user details from cache, if they exist
    await client.del(`/users/${req.params.UserId}`)
    await client.del(`/users/all`);
    res.status(200).json({updatedUser: updatedUser})
};

export const handleProfileImg = async (req: Request, res: Response) => {
    if(!req.file) return res.status(400).json({message: 'No File Sent In Request'});
    
    const file: any = req.file;
    const updatedUser = await prisma.users.update({where: {Id: req.params.UserId}, data: {ProfileImg: file.location}});
    
    await client.del(`/users/all`);
    await client.del(`/users/${updatedUser.Id}`);

    return res.status(200).json({updatedUser: updatedUser})
};

export const profileImgDelete = async (req: Request, res: Response) => {
    await prisma.users.update({where: {Id: req.params.UserId}, data: {ProfileImg: null}})

    await client.del(`/users/all`);
    return res.status(200).json({message: 'Image Successfully Deleted'})
};

export const get_profile_info = async (req: Request, res: Response) => {
    const info = await prisma.profile_Info.findFirst({where: {UserId: req.params.UserId}})

    return res.status(200).json({info: info})
}

export const update_profile_info = async (req: Request, res: Response) => {
    const schema = Joi.object({
        Bio: Joi.string()
            .max(300)
            .required()
    });

    const { error } = schema.validate(req.body, {abortEarly: false});

    if(error) return res.status(400).json({message: "Error updating profile info"})

    const profile = await prisma.profile_Info.findFirst({where: {UserId: req.params.UserId}})

    const updatedProfileInfo = await prisma.profile_Info.update({where: {Id: profile?.Id}, data: {Bio: req.body.Bio}})

    return res.status(200).json({updatedProfileInfo: updatedProfileInfo})
}