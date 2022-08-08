import { Request, Response, NextFunction } from 'express'
import { getClient } from '../../config/redis/redis.config';

const client = getClient();

const checkUserPostsCache = async (req: Request, res: Response, next: NextFunction) => {
    const posts = await client.get(`/posts/${req.params.UserId}`);

    if(!posts) {
        return next()
    }

    return res.status(200).json({posts: JSON.parse(posts)})
}

export default checkUserPostsCache;