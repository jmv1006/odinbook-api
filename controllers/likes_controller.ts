import con from "../config/db/db";
import { Request, Response } from "express";
import { v4 } from "uuid";
//Create Like
export const create_post_like = (req: Request, res: Response) => {
    con.query(`SELECT * FROM Post_Likes WHERE User="${req.params.UserId}" AND Post="${req.params.PostId}"`, (err, result) => {
        if (err) return res.status(500).json({message: "Server Error"})
        if(result.length > 0) return res.status(400).json({message: "Post Is Already Liked By User"});

        con.query(`SELECT Id FROM Posts WHERE Id="${req.params.PostId}"`, (err, result) => {
            if (err) return res.status(500).json({message: "Server Error"})
            if (result.length === 0) return res.status(400).json({message: "Post Does Not Exist"});
    
            con.query(`INSERT INTO Post_Likes (Id, User, Post) VALUES ("${v4()})", "${req.params.UserId}", "${req.params.PostId}")`, (err) => {
                if (err) return res.status(500).json({message: "Server Error"})
                return res.status(200).json({message: "Successfully Created Like"})
            })
        })
    })
};

export const remove_post_like = (req: Request, res: Response) => {
    con.query(`DELETE FROM Post_Likes WHERE Post="${req.params.PostId}" AND User="${req.params.UserId}"`, (err) => {
        if(err) return res.status(500).json({message: "Error Removing Like From DB"})
        res.status(200).json({message: "Successfully Removed Like"})
    })
};