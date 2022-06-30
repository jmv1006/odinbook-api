import { Strategy } from "passport-facebook";

const idString: string = (process.env.FB_CLIENT as string);
const secretString: string = (process.env.FB_SECRET as string);

const FacebookStrategy = new Strategy({
    clientID: idString,
    clientSecret: secretString,
    callbackURL: "http://localhost:7000/test"
},(accessToken, refreshToken, profile, done) => {
    //if cant find user in db, create one!
    return done(null, profile)
})

export default FacebookStrategy;