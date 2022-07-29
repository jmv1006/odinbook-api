import  {Request, Response} from 'express';
import Joi from 'joi';
import { v4 } from 'uuid';
import { hash } from 'bcryptjs';
import passport from 'passport';
import { sign } from 'jsonwebtoken';
import client from '../config/redis/redis.config';
import prisma from '../config/prisma/initialize-client';

export const log_in = (req: Request, res: Response) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if(err) {
            return res.status(500).json('Server Error')
        }

        if(!user) {
            return res.status(400).json({message: info.message})
        }
        
        const tokenUser: any = {
            Id: user.Id,
            DisplayName: user.DisplayName,
            Email: user.Email,
            ProfileImg: user.ProfileImg
        }
        
        const tokenSecret: any = process.env.TOKEN_SECRET;
        
        const token = sign({user: tokenUser}, tokenSecret, {expiresIn: '15m'})
    
        return res.status(200).cookie('token', token, {httpOnly: true, sameSite: 'strict', secure: true}).json({
            message: 'Auth Passed',
            user: tokenUser,
        });

    })(req, res)
}

export const sign_up = async (req: Request, res: Response) => {
    const schema = Joi.object({
        Email: Joi.string()
            .email()
            .min(3)
            .max(30)
            .required(),
        DisplayName: Joi.string()
            .min(3)
            .max(30)
            .required(),
        Password: Joi.string()
            .min(3)
            .required(),
        ConfirmedPassword: Joi.string()
            .min(3)
            .valid(Joi.ref('Password'))
            .required()
    });

    const { error } = schema.validate(req.body, {abortEarly: false})

    if(error) {
        res.status(400).json({message: "Error Signing Up"})
        return
    }

    const existingUser = await prisma.users.findFirst({where: {Email: req.body.Email}});
    if(existingUser) return res.status(400).json({message: "User Already Exists"})

    
    hash(req.body.Password, 10, async (err, hashedPassword) => {
        const createdUser = await prisma.users.create({
            data: {
                Id: v4(),
                DisplayName: req.body.DisplayName,
                Email: req.body.Email,
                ProfileImg: "https://i.stack.imgur.com/l60Hf.png",
                Password: hashedPassword
            }
        })

        await prisma.profile_Info.create({
            data: {
                Id: v4(),
                UserId: createdUser.Id,
                Bio: ""
            }
        })
        await client.del(`/users/all`);

        const tokenUser: any = {
            Id: createdUser.Id,
            DisplayName: createdUser.DisplayName,
            Email: createdUser.Email,
            ProfileImg: createdUser.ProfileImg
        }
        
        const tokenSecret: any = process.env.TOKEN_SECRET;
        
        const token = sign({user: tokenUser}, tokenSecret, {expiresIn: '15m'})

        return res.status(200).cookie("token", token).json({user: createdUser})
    });
};

export const log_in_facebook_success = (req: Request, res: Response) => {
    res.json(req.user)
}

export const check_for_token = (req: Request, res: Response) => {
    if(req.user){
        res.status(200).json({user: req.user})
    }
};