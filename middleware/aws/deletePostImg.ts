import {Request, Response, NextFunction} from 'express';
import s3 from '../../config/aws/aws.config';
import prisma from '../../config/prisma/initialize-client';

const deletePostImg = async (req: Request, res: Response, next: NextFunction) => {
    const imgUrl = await prisma.posts.findFirst({where: {Id: req.params.PostId}})
    if(!imgUrl?.Image) return next();

    const key = imgUrl?.Image.slice(52);

    const params = {Bucket: 'odinbook-jmv1006', Key: key};

    s3.deleteObject(params, (err: any, data: any) => {
        if(err) return res.status(500).json({message: err});
    });
    
   next();
};

export default deletePostImg;