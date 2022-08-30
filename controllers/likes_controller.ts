import { Request, Response } from "express";
import { v4 } from "uuid";
import prisma from "../config/prisma/initialize-client";

export const get_post_likes = async (req: Request, res: Response) => {
  const likes = await prisma.post_Likes.findMany({
    where: { Post: req.params.PostId },
  });
  res.json({ likes: likes, amount: likes.length });
};

export const toggle_post_like = async (req: Request, res: Response) => {
  const postIsLiked = await prisma.post_Likes.findFirst({
    where: { User: req.params.UserId, Post: req.params.PostId },
  });
  if (postIsLiked) {
    await prisma.post_Likes.deleteMany({
      where: { User: req.params.UserId, Post: req.params.PostId },
    });
    await prisma.notifications.deleteMany({
      where: { From_User: req.params.UserId },
    });
    return res.status(200).json({ message: "Successfully Removed Like" });
  }

  const postToBeLiked = await prisma.posts.findUnique({
    where: { Id: req.params.PostId },
  });

  if (postToBeLiked?.UserId !== req.params.UserId) {
    //create a notification
    await prisma.notifications.create({
      data: {
        Id: v4(),
        From_User: req.params.UserId,
        To_User: postToBeLiked?.UserId,
        Notification_Type: "like",
        Post_Id: postToBeLiked?.Id,
      },
    });
  }

  await prisma.post_Likes.create({
    data: {
      Id: v4(),
      User: req.params.UserId,
      Post: req.params.PostId,
    },
  });

  return res.status(200).json({ message: "Successfully Created Like" });
};
