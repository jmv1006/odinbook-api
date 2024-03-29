import "dotenv/config";
import { Request, Response } from "express";
import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import { connectToRedis } from "./config/redis/redis.config";
import cors from "cors";

import LocalStrategy from "./config/passport/local";
import JWTStrategy from "./config/passport/jwt";

import authRoute from "./routes/auth";
import postsRoute from "./routes/posts";
import likesRoute from "./routes/likes";
import commentsRoute from "./routes/comments";
import userRoute from "./routes/user";
import notificationsRoute from "./routes/notifications";
import friendRequestsRoute from "./routes/friend-requests";
import friendshipsRoute from "./routes/friendships";

import helmet from "helmet";

const app = express();

const options: cors.CorsOptions = {
  origin: "*",
};

app.use(cors(options));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

const redisConnect = async () => {
  await connectToRedis();
};

redisConnect();

passport.use(LocalStrategy);
passport.use(JWTStrategy);
passport.initialize();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello From API!" });
});

app.use("/auth", authRoute);
app.use("/posts", passport.authenticate("jwt", { session: false }), postsRoute);
app.use("/likes", passport.authenticate("jwt", { session: false }), likesRoute);
app.use(
  "/comments",
  passport.authenticate("jwt", { session: false }),
  commentsRoute
);
app.use("/users", passport.authenticate("jwt", { session: false }), userRoute);
app.use(
  "/friend-requests",
  passport.authenticate("jwt", { session: false }),
  friendRequestsRoute
);
app.use(
  "/friendships",
  passport.authenticate("jwt", { session: false }),
  friendshipsRoute
);
app.use(
  "/notifications",
  passport.authenticate("jwt", { session: false }),
  notificationsRoute
);

export default app;
