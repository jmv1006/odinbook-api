import {Request, Response, NextFunction} from 'express';

const checkForFile = (req: Request, res: Response, next: NextFunction) => {
    if(!req.file) return res.status(400).json({message: 'Error Uploading File'})
    next()
}

export default checkForFile;