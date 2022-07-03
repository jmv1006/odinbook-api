import con from "../config/db/db";
import { Request, Response } from "express";
import Joi from "joi";
import { v4 } from "uuid";

export const get_all_posts = (req: Request, res: Response) => {
    con.query(`SELECT * FROM POSTS`, (err, result) => {
        if(err) return res.status(500).json({message: "Server Error"})
        return res.status(200).json(result)
    })
};

export const create_post = (req: Request, res: Response) => {
    const schema = Joi.object({
        Text: Joi.string()
            .min(1)
            .required(),
    });

    const { error } = schema.validate(req.body, {abortEarly: false})

    if(error) return res.status(400).json("Error Creating Post")
    
    con.query(`SELECT Id FROM Users WHERE Id="${req.params.UserId}"`, (err, result) => {
        if(err) return res.status(500).json({message: "Server Error"})
        if(result.length === 0) return res.status(400).json({message: "User Does Not Exist"})
        
        con.query(`INSERT INTO Posts (Id, UserId, Text) VALUES ("${v4()}", "${req.params.UserId}", "${req.body.Text}")`, (err) => {
            if(err) return res.status(500).json({message: "Error Creating Post"});
            return res.status(200).json({message: "Successfully Created Post"})
        })
    })
};

export const get_timeline_posts = (req: Request, res: Response) => {

    //Select from friendships
    
    //Design an algoritm that gets me the users post AND the posts of their friends
    //SELECT from Posts WHERE Id=UserId or Id in()
}
