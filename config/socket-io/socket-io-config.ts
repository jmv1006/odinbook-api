import { io } from '../../server';
import prisma from '../prisma/initialize-client';

io.on('connection', (socket) => {
    let user = ""

    socket.on('user-identify', (userId) => {
        user = userId;
        socket.join(user);
    });

    socket.on('event', (event, userId) => {
        if(user === userId) return console.log('Same User')
        //io.to(user).emit("event", event)
    })

    socket.on('post', async (userId: string) => {
        //Alert all amigos
        const friendships = await prisma.friendships.findMany({where: {OR: [{User1: userId}, {User2: userId}]}})
        const friendsIds: Array<any> = friendships.map(friendship => friendship.User1 === userId ? friendship.User2 : friendship.User1);

        friendsIds.forEach((room) => {
            io.sockets.in(room).emit('new-post')
        });
    });

    socket.on('notification', (targetUser, fromUser) => {
        if(targetUser === fromUser) return
        //when a notification is triggered, send it to the target User Id with the type
        io.sockets.in(targetUser).emit('notification')
    });
});