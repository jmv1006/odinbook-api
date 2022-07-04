import  {Request, Response} from 'express';
import express from "express";
import passport from 'passport';
import 'dotenv/config';

import FacebookStrategy from './config/passport/facebook';
import LocalStrategy from './config/passport/local';
import JWTStrategy from './config/passport/jwt';

import authRoute from './routes/auth';
import postsRoute from './routes/posts';
import likesRoute from './routes/likes'
import commentsRoute from './routes/comments'
import userRoute from './routes/user';
import friendRequestsRoute from './routes/friend-requests';

import helmet from 'helmet';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

passport.use(FacebookStrategy);
passport.use(LocalStrategy);
passport.use(JWTStrategy);
passport.initialize();

app.use('/auth', authRoute);
app.use('/posts', postsRoute);
app.use('/likes', likesRoute);
app.use('/comments', commentsRoute);
app.use('/users', userRoute);
app.use('/friend-requests', friendRequestsRoute)

app.get('/', (req: Request, res: Response) => {
    res.json("Hello From API!")
});

const port = 7000 || process.env.PORT;

app.listen(port, () => {
    console.log(`Server running on port ${port}!`)
});