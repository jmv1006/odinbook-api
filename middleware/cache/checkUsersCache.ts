import { Request, Response, NextFunction } from "express";
import { getClient } from "../../config/redis/redis.config";

const client = getClient();

const checkUsersCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await client.get(`/users/${req.params.UserId}`);

  if (!user) {
    return next();
  }

  return res.status(200).json({ user: JSON.parse(user) });
};

export default checkUsersCache;
