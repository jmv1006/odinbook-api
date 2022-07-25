import { faker } from '@faker-js/faker';
import prisma from './config/prisma/initialize-client';
import { v4 } from 'uuid';
import client from './config/redis/redis.config';

const randomName = faker.name.findName();  // Rowan Nikolaus
const password = faker.word.noun();
const email = faker.word.noun() + faker.word.adjective() + "@gmail.com";

const fakeUsers = [];

interface IUser {
    Email: string, 
    DisplayName: string,
    Password: string
}

for(let i  = 0; i < 100; i++) {
    const randomName = faker.name.findName();  // Rowan Nikolaus
    const password = faker.word.noun() + faker.word.adjective();
    const email = faker.word.noun() + faker.word.adjective() + "@gmail.com";

    const fakeUser: IUser = {
        Email: email,
        DisplayName: randomName,
        Password: password
    }
    fakeUsers.push(fakeUser)
}   

const createUser = async (user: IUser) => {
    const createdUser = await prisma.users.create({
        data: {
            Id: v4(),
            DisplayName: user.DisplayName,
            Email: user.Email,
            ProfileImg: "https://i.stack.imgur.com/l60Hf.png",
            Password: user.Password
        }
    });

    await prisma.profile_Info.create({
        data: {
            Id: v4(),
            UserId: createdUser.Id,
            Bio: ""
        }
    });
};

fakeUsers.forEach(async (user: IUser) => {
   //createUser(user)
});

client.del(`/users/all`);
console.log('done')