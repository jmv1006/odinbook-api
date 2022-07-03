import {Request, Response} from 'express';
import { check_if_user_exists } from '../helpers/check_if_exists';

export const get_all_users = async (req: Request, res: Response) => {
    res.json('All users here')
};

export const get_specific_user = (req: Request, res: Response) => {
    res.json("Specific User Info")
};

export const get_user_friends = (req: Request, res: Response) => {
    //select from friendships where user1 or user2 equals userId
    res.json("user friends here")
};

export const create_friends = async (req: Request, res: Response) => {
    //check if both users exist
    const user1Exists = await check_if_user_exists(req.params.User1Id);
    const user2Exists = await check_if_user_exists(req.params.User2Id);

    if(!user1Exists || !user2Exists) return res.status(400).json({message: "Error Creating Friendship"})
    res.json("Post friends here")
}
