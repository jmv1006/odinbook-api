import { NextFunction, Request, Response } from "express";
import prisma from "../../config/prisma/initialize-client";
import s3 from "../../config/aws/aws.config";

const handlePostEdit = async (req: Request, res: Response, next: NextFunction) => {
    //if user wants to delete post image, delete it
    if(req.body.deleteImage === 'true') {
        //delete image and its location in db
        const imgUrl = await prisma.posts.findFirst({where: {Id: req.params.PostId}})
        if(!imgUrl?.Image) return next();
    
        const key = imgUrl?.Image.slice(52);
    
        const params = {Bucket: 'odinbook-jmv1006', Key: key};
    
        s3.deleteObject(params, (err: any, data: any) => {
            if(err) return res.status(500).json({message: err});
        });
        await prisma.posts.update({where: {Id: req.params.PostId}, data: {Image: null}});
    }
    next();
}

export default handlePostEdit;