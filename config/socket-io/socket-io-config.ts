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

    //TO-DO: When a user creates a post, the news feed of their friends page should reflect it...

    socket.on('post', async (userId: string) => {
        //Alert all amigos
        const friendships = await prisma.friendships.findMany({where: {OR: [{User1: userId}, {User2: userId}]}})
        const friendsIds: Array<any> = friendships.map(friendship => friendship.User1 === userId ? friendship.User2 : friendship.User1);

        friendsIds.forEach((room) => {
            io.sockets.in(room).emit('new-post')
        });
    });

    socket.on('notification', async (userId: string, type: string, entityId: string) => {

        //when a notification is triggered, send it to the target User Id with the type
        io.sockets.in(userId).emit('notification', {type: type, entityId: entityId})
    });
});