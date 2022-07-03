import  {Request, Response} from 'express';
import Joi from 'joi';
import { v4 } from 'uuid';
import { hash } from 'bcryptjs';
import passport from 'passport';
import { sign } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const log_in = (req: Request, res: Response) => {
    passport.authenticate('local', {session: false}, (err, user) => {
        if(err) {
            return res.status(400).json('Error Authenticating User')
        }

        if(!user) {
            return res.status(400).json("Error Signing In")
        }
        
        const tokenUser: any = {
            Id: user.Id,
            DisplayName: user.DisplayName,
            Email: user.Email,
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
        res.status(400).json("Error Signing Up")
        return
    }

    const existingUser = await prisma.users.findFirst({where: {Email: req.body.Email}});
    if(existingUser) return res.status(400).json({message: "User Already Exists"})

    
    hash(req.body.Password, 10, async (err, hashedPassword) => {
        await prisma.users.create({
            data: {
                Id: v4(),
                DisplayName: req.body.DisplayName,
                Email: req.body.Email,
                Password: hashedPassword
            }
        })
        return res.status(200).json({message: "Successfully Created User"})
    });
};

export const log_in_facebook = (req: Request, res: Response) => {
    passport.authenticate('facebook', {session: false}, (err, user) => {
        if(err) {
            return res.status(400).json('Error Authenticating User')
        }

        if(!user) {
            return res.status(400).json("Error Signing In")
        }
        res.send("hello")
    })(req, res)
};