
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import con from "../db/db";

const cookieExtractor = (req: any) => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies['token']
    }
    return token
};

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.TOKEN_SECRET
};

const strategy = new Strategy(opts, (payload, done) => {
    console.log(payload)
    con.query(`SELECT * FROM Users WHERE Id="${payload.user.Id}"`, (err, result) => {
        if(err) {
            //error connecting to db
        }
        if(!result) {
            return done(null, false)
        }
        return done(null, result[0])
    });
});

export default strategy;