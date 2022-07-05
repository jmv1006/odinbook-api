import { Strategy } from "passport-facebook";
import prisma from "../prisma/initialize-client";

const idString: string = (process.env.FB_CLIENT as string);
const secretString: string = (process.env.FB_SECRET as string);

const FacebookStrategy = new Strategy({
    clientID: idString,
    clientSecret: secretString,
    callbackURL: "http://localhost:7000/auth/log-in/facebook",
    profileFields: ['id', 'displayName', 'photos', 'email']
},async (accessToken, refreshToken, profile, done) => {
    const user = await prisma.users.findUnique({where: {Id: profile.id}});

    if(!profile) return done(null, false);

    //TODO Create user in DB
    if(!user) {
        //Create a new user
        console.log("No user in DB")
    } 

    //IF User
    //return 

    return done(null, profile._json)
})
 
export default FacebookStrategy;