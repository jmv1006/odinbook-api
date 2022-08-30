import { Request, Response } from "express";
import { v4 } from "uuid";
import { getClient } from "../config/redis/redis.config";
import prisma from "../config/prisma/initialize-client";

const client = getClient();

export const get_all_friendships = async (req: Request, res: Response) => {
  const friendships = await prisma.friendships.findMany();
  res.json(friendships);
};

export const get_user_friends = async (req: Request, res: Response) => {
  //finds frienships where user is a member
  const friendships = await prisma.friendships.findMany({
    where: { OR: [{ User1: req.params.UserId }, { User2: req.params.UserId }] },
  });

  //filters out Ids of friends and into an array
  const friendsIds: Array<any> = friendships.map((friendship) =>
    friendship.User1 === req.params.UserId ? friendship.User2 : friendship.User1
  );

  //finds friends
  const friends = await prisma.users.findMany({
    where: { Id: { in: friendsIds } },
    select: { Id: true, DisplayName: true, Email: true, ProfileImg: true },
  });

  //adding users friendlist to cache
  await client.setEx(
    `/friends/${req.params.UserId}`,
    3600,
    JSON.stringify(friends)
  );

  res.json({ friends: friends });
};

export const create_friends = async (req: Request, res: Response) => {
  //If User Ids provided are the same
  if (req.params.User1Id === req.params.User2Id)
    return res
      .status(400)
      .json({
        message: "Cannot Create A Friendship Using Two Of The Same User!",
      });

  //If frienship already exists
  const friendship = await prisma.friendships.findFirst({
    where: {
      OR: [
        { User1: req.params.User1Id, User2: req.params.User2Id },
        { User1: req.params.User2Id, User2: req.params.User1Id },
      ],
    },
  });
  if (friendship)
    return res
      .status(400)
      .json({ message: "Friendship Between Users Already Exists" });

  //check if both users exist
  const user1 = await prisma.users.findFirst({
    where: { Id: req.params.User1Id },
  });
  const user2 = await prisma.users.findFirst({
    where: { Id: req.params.User2Id },
  });

  if (!user1 || !user2)
    return res
      .status(400)
      .json({ message: "At least one of the users does not exist" });

  //if they exist, create a friendship between them
  await prisma.friendships.create({
    data: {
      Id: v4(),
      User1: req.params.User1Id,
      User2: req.params.User2Id,
    },
  });

  await client.del(`/friends/${req.params.User1Id}`);
  await client.del(`/friends/${req.params.User2Id}`);

  const request = await prisma.friend_requests.findFirst({
    where: {
      OR: [
        { From_uuid: req.params.User1Id, To_uuid: req.params.User2Id },
        { From_uuid: req.params.User2Id, To_uuid: req.params.User1Id },
      ],
    },
  });

  await prisma.friend_requests.delete({ where: { Id: request?.Id } });

  res.status(200).json({ message: "Successfully Created Friendship" });
};

export const delete_friends = async (req: Request, res: Response) => {
  const friendship = await prisma.friendships.findFirst({
    where: {
      OR: [
        { User1: req.params.User1, User2: req.params.User2 },
        { User1: req.params.User2, User2: req.params.User1 },
      ],
    },
  });
  if (!friendship)
    return res
      .status(400)
      .json({ message: "Friendship with given ID does not exist" });

  await client.del(`/friends/${friendship.User1}`);
  await client.del(`/friends/${friendship.User2}`);

  await prisma.friendships.delete({ where: { Id: friendship.Id } });

  res.status(200).json({ message: "Successfully Deleted Friendship" });
};

export const get_suggested_friends = async (req: Request, res: Response) => {
  const adjancency_list: any = {};

  //find user friends
  const friendships = await prisma.friendships.findMany({
    where: { OR: [{ User1: req.params.UserId }, { User2: req.params.UserId }] },
  });

  //filters out Ids of friends and into an array
  const friendsIds: Array<any> = friendships.map((friendship) =>
    friendship.User1 === req.params.UserId ? friendship.User2 : friendship.User1
  );

  const amountOfFriends: number = friendsIds.length;
  let number = 1;

  //create a node in graph for user
  adjancency_list[req.params.UserId] = [];

  //for each of user's friends, create a graph node, then create a graph node for their friends
  for (const x in friendsIds) {
    populateGraph(friendsIds[x], verifyDone);
  }

  //callback that verifies that graph nodes have been completed for all of user's friends and their friends as well
  function verifyDone() {
    if (number === amountOfFriends) {
      bfs(req.params.UserId);
    } else {
      number++;
    }
  }

  async function populateGraph(id: string, cb: any) {
    //creating node in graph for friend
    adjancency_list[id] = [];

    //populate friend's value array with user id
    adjancency_list[id].push(req.params.UserId);

    //populate user's array with friend's id
    adjancency_list[req.params.UserId].push(id);

    //get friends of friends
    const friendsOfFriend = await prisma.friendships.findMany({
      where: {
        OR: [{ User1: id }, { User2: id }],
        NOT: {
          OR: [{ User1: req.params.UserId }, { User2: req.params.UserId }],
        },
      },
    });

    //ids of friends of friend
    const filteredIds = friendsOfFriend.map((friendship) =>
      friendship.User1 === id ? friendship.User2 : friendship.User1
    );

    //add friends of friend to graph
    function addFriendsOfFriendToGraph(friendId: any) {
      if (!(friendId in adjancency_list)) {
        adjancency_list[friendId] = [];
      }

      const existsMutual = adjancency_list[friendId].some(
        (id: any) => id === id
      );

      if (!existsMutual) {
        adjancency_list[friendId].push(id);
      }

      adjancency_list[id].push(friendId);
    }

    //create node for filteredIds and populate them
    for (const x in filteredIds) {
      await addFriendsOfFriendToGraph(filteredIds[x]);
    }

    cb();
  }

  //breadth first search to find which friends(nodes) that user is not friends with
  async function bfs(node: any) {
    const queue = [];
    const result: any = [];
    const visited: any = {};

    visited[node] = node;
    queue.push(node);

    while (queue.length > 0) {
      const current: any = queue.pop();

      const currentIsFriend = adjancency_list[req.params.UserId].some(
        (id: string) => id === current
      );

      if (current != req.params.UserId && !currentIsFriend) {
        result.push(current);
      }

      for (const friend in adjancency_list[current]) {
        const id: string = adjancency_list[current][friend];
        if (!(id in visited)) {
          visited[id] = id;
          queue.push(id);
        }
      }
    }
    //sending results of bfs to create response function
    createResponse(result);
  }

  async function createResponse(result: Array<any>) {
    const suggestedUsers = await prisma.users.findMany({
      where: { Id: { in: result } },
      select: { Id: true, DisplayName: true, Email: true, ProfileImg: true },
    });
    res.status(200).json({ users: suggestedUsers });
  }
};
