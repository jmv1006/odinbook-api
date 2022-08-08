import request from 'supertest';
import express from 'express'
import PostsRouter from '../../routes/posts';

const app = express()
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/posts', PostsRouter)

test("user posts works", done => {
    request(app)
        .get('/posts/ff89861a-552a-496c-9a30-efc3eb79d300')
        .expect("Content-Type", /json/)
        .expect(200, done)
});

test("user timeline posts works", done => {
    request(app)
        .get('/posts/ff89861a-552a-496c-9a30-efc3eb79d300/timeline')
        .expect("Content-Type", /json/)
        .expect(200, done)
});

test("returns error for unknown user", done => {
    request(app)
        .get('/posts/123')
        .expect(400, done)
});