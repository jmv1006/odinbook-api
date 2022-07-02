import  {Request, Response} from 'express';
import con from '../config/db/db';
import Joi from 'joi';
import { v4 } from 'uuid';
import { hash } from 'bcryptjs';
import passport from 'passport';
import { sign } from 'jsonwebtoken';

export const log_in = (req: Request, res: Response) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if(err) {
            return res.status(400).json('Error Authenticating User')
        }

        if(!user) {
            return res.status(400).json("Error Signing In")
        }
        
        const tokenUser = {
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

export const sign_up = (req: Request, res: Response) => {
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
    };

    con.query(`SELECT * FROM Users WHERE Email="${req.body.Email}"`, (err, result) => {
        if(result.length > 0) return res.status(400).json({message: "User Already Exists"})

        hash(req.body.Password, 10, (err, hashedPassword) => {
            con.query(`INSERT INTO Users (Id, DisplayName, Email, Password) VALUES ("${v4()}", "${req.body.DisplayName}", "${req.body.Email}", "${hashedPassword}")`, (err, result) => {
                if(err) return res.status(500).json({message: "Server Error"})
                return res.status(200).json({message: "Successfully Created User"})
            });
        });

    });
};
