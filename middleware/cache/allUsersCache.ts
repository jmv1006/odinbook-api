import { Request, Response, NextFunction } from 'express'
import client from '../../config/redis/redis.config'

const allUsersCache = async (req: Request, res: Response, next: NextFunction) => {
    const users = await client.get(`/users/all`);
   
    if(!users) {
        return next()
    }

    return res.status(200).json({users: JSON.parse(users)})
}

export default allUsersCache;