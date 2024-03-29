import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
});

//client.on('error', (err) => console.log('Redis Client Error', err));

client.on('connect', () => console.log("Successfully Connected To Redis"));

export const connectToRedis = async () => {
    await client.connect();
};

export const getClient = () => {
    return client;
};