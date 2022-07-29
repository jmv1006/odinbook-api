import { Strategy } from "passport-local";
import { compare } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const LocalStrategy = new Strategy({usernameField: "Email", passwordField: "Password"}, async (Email, Password, done) => {
    const user = await prisma.users.findFirst({where: {Email: Email}})

    if(!user) return done(null, false, { message: "User Not Found" });

    if(user) {
        compare(Password, user.Password, (err, res) => {
            if(res) {
                return done(null, user)
            }
            return done(null, false, { message: "Incorrect Password" })
        })
    }
});

export default LocalStrategy;