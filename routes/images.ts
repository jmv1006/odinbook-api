import express from "express";
import { Request, Response } from "express";
const router = express.Router();
import upload from "../config/multer/multer-config";
import checkForFile from '../middleware/check_for_file';
import checkIfUserExists from '../middleware/check_user_exists';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

router.post('/:UserId/upload', checkIfUserExists, upload.single('image'), checkForFile, async (req: Request, res: Response) => {
    const file: any = req.file;
    await prisma.users.update({where: {Id: req.params.UserId}, data: {ProfileImg: file.location}});
    res.status(200).json({message: "Upload Successful"})
});

export default router;