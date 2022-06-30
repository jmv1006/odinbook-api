import express from "express";
import  {Request, Response} from 'express';
import passport from "passport";
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    passport.authenticate('facebook', {session: false}, (err, user, info) => {
        if(user) console.log(user)
        res.json("Test works")
    })(req, res)
})

export default router;