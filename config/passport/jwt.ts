import { Request } from "express";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cookieExtractor = (req: Request) => {
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

const strategy = new Strategy(opts, async (payload, done) => {
    const user = await prisma.users.findUnique({where: {Id: payload.user.Id}, select: {Id: true, DisplayName: true, Email: true, ProfileImg: true}});

    if(!user) return done(null, false)

    return done(null, user)
});

export default strategy;