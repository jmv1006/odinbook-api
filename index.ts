import  {Request, Response} from 'express';
import express from "express";
import passport from 'passport';
import 'dotenv/config';
import './config/db/db';
import FacebookStrategy from './config/passport/facebook';
import LocalStrategy from './config/passport/local';
import JWTStrategy from './config/passport/jwt';
import authRoute from './routes/auth';
import postsRoute from './routes/posts';
import likesRoute from './routes/likes'
import commentsRoute from './routes/comments'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use(FacebookStrategy);
passport.use(LocalStrategy);
passport.use(JWTStrategy);
passport.initialize();

app.use('/auth', authRoute);
app.use('/posts', passport.authenticate('jwt'), postsRoute);
app.use('/likes', passport.authenticate('jwt'), likesRoute);
app.use('/comments', passport.authenticate('jwt'),  commentsRoute);

app.get('/', (req: Request, res: Response) => {
    res.json("Hello From API!")
});

const port = 7000;

app.listen(port, () => {
    console.log(`Server running on port ${port}!`)
});