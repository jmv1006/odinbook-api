import multer from "multer"
import {Request} from 'express'
import multerS3 from 'multer-s3';
import s3 from "../aws/aws.config";
import path from "path";

const uploadProfileImage = multer({
    fileFilter(req: Request, file: any, done) {
        const ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return done(null, false)
        }

        done(null, file)
    },
    storage: multerS3({
        s3: s3,
        bucket: 'odinbook-jmv1006',
        key: function (req: Request, file, done) {
            const ext: string = path.extname(file.originalname);
            done(null, req.params.UserId + '-profileimg' + ext);
        }
    })
});

const uploadPostImage = multer({
    fileFilter(req: Request, file: any, done) {
        const ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.JPG') {
            return done(null, false)
        }
        done(null, file)
    },
    storage: multerS3({
        s3: s3,
        bucket: 'odinbook-jmv1006',
        key: function (req: Request, file, done) {
            const sanitized = file.originalname.replace(/\s/g, '');
            if(req.params.UserId) {
                const finalKey = req.params.UserId + sanitized
                return done(null, finalKey)
            }
            else if (req.params.PostId) {
                const finalKey = req.params.PostId + sanitized
                return done(null, finalKey)
            }
        }
    })
});

export {uploadProfileImage, uploadPostImage};