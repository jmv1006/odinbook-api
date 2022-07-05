import {Request, Response, NextFunction} from 'express'
import prisma from '../../config/prisma/initialize-client';

const checkPostExists = async (req: Request, res: Response, next: NextFunction) => {
    const postExists = await prisma.posts.findUnique({where: {Id: req.params.PostId}})
    if(!postExists) return res.status(400).json({message: "Post Does Not Exist"})
    next()
};

export default checkPostExists;