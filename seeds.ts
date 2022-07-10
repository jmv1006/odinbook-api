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

for(let i  = 0; i < 20; i++) {
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

fakeUsers.forEach(async (user: IUser) => {
    await prisma.users.create({
        data: {
            Id: v4(),
            Email: user.Email,
            DisplayName: user.DisplayName,
            Password: user.Password
        }
    })

    console.log('done')
})

client.del('/users/all')