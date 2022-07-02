import con from "../config/db/db";
import { Request, Response } from "express";
import { v4 } from "uuid";
import Joi from "joi";

export const create_comment = (req: Request, res: Response) => {
    const schema = Joi.object({
        Text: Joi.string()
            .min(1)
            .max(500)
            .required(),
    });

    const { error } = schema.validate(req.body, {abortEarly: false})

    if(error) return res.status(400).json({message: "Input Error"})

    con.query(`SELECT * FROM Users WHERE Id="${req.params.UserId}"`, (err, result) => {
        if (err) return res.status(500).json({message: "Server Error"});
        if(result.length === 0) return res.status(400).json({message: "User Does Not Exist"})

        con.query(`SELECT * FROM Posts Where Id="${req.params.PostId}"`, (err, result) => {
            if (err) return res.status(500).json({message: "Server Error"});
            if(result.length === 0) return res.status(400).json({message: "Post Does Not Exist"})

            con.query(`INSERT INTO Comments (Id, Text, User, Post) VALUES ("${v4()}", "${req.body.text}", "${req.params.UserId}", "${req.params.PostId}")`, (err) => {
                if (err) return res.status(500).json({message: "Server Error"});
                res.status(200).json({message: "Successfully Created Comment"})
            })
        })
    });
};

