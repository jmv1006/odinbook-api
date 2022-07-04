import { Strategy } from "passport-facebook";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const idString: string = (process.env.FB_CLIENT as string);
const secretString: string = (process.env.FB_SECRET as string);

const FacebookStrategy = new Strategy({
    clientID: idString,
    clientSecret: secretString,
    callbackURL: "http://localhost:7000/auth/log-in/facebook"
},async (accessToken, refreshToken, profile, done) => {
    const user = await prisma.users.findUnique({where: {Id: profile.id}});

    if(!user) //TO-DO: Create User In DB

    return done(null, profile)
})
 
export default FacebookStrategy;