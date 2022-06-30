import  {Request, Response} from 'express';
import passport from 'passport';
import 'dotenv/config'
import FacebookStrategy from './config/passport/facebook';
import LocalStrategy from './config/passport/local';
import express from "express";
import testRoute from './routes/test';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use(FacebookStrategy);
passport.use(LocalStrategy);
passport.initialize();

app.use('/test', testRoute);

app.get('/', (req: Request, res: Response) => {
    res.json("Hello From API!")
});

const port = 7000;

app.listen(port, () => {
    console.log(`Server running on port ${port}!`)
});