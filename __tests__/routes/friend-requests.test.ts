import request from 'supertest';
import express from 'express'
import FriendsRequestsRouter from '../../routes/friend-requests';
import * as dotenv from 'dotenv';

dotenv.config({path: `.env.test`})

const app = express()
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/friend-requests', FriendsRequestsRouter);

const testUserId = "ff89861a-552a-496c-9a30-efc3eb79d300";

test("get all friend requests that involve user", done => {
    request(app)
        .get(`/friend-requests/${testUserId}`)
        .expect("Content-Type", /json/)
        .expect(200, done)
});

test("get all friend requests that user sent", done => {
    request(app)
        .get(`/friend-requests/sent/${testUserId}`)
        .expect("Content-Type", /json/)
        .expect(200, done)
});

test("get all friend requests that user recieved", done => {
    request(app)
        .get(`/friend-requests/recieved/${testUserId}`)
        .expect("Content-Type", /json/)
        .expect(200, done)
});

test("friend requests between users does not exist", done => {
    request(app)
        .get(`/friend-requests/${testUserId}/1234`)
        .expect("Content-Type", /json/)
        .expect({exists: false})
        .expect(200, done)
});




