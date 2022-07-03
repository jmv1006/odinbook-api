import { Strategy } from "passport-facebook";
import con from "../db/db";

const idString: string = (process.env.FB_CLIENT as string);
const secretString: string = (process.env.FB_SECRET as string);

const FacebookStrategy = new Strategy({
    clientID: idString,
    clientSecret: secretString,
    callbackURL: "http://localhost:7000/auth/log-in/facebook"
},(accessToken, refreshToken, profile, done) => {
    //if cant find user in db, create one!
    con.query(`SELECT * FROM Users WHERE Id="${profile.id}"`, (err, result) => {
        if(result.length === 0) {
            //no user exists create one
        }
    })
    return done(null, profile)
})
 
export default FacebookStrategy;