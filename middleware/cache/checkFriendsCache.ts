import { Request, Response, NextFunction } from 'express'
import client from '../../config/redis/redis.config'

const checkFriendsCache = async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.params.UserId;

    const friends = await client.get(`/friends/${userId}`);
    
    if(!friends) {
        return next()
    }

    return res.status(200).json({friends: JSON.parse(friends)})
}

export default checkFriendsCache;