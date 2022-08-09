import request from 'supertest';
import express from 'express'
import authRoute from '../../routes/auth';
import * as dotenv from 'dotenv';

dotenv.config({path: `.env.test`})

const app = express()
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoute)

app.get('/', (req, res) => {
    res.send("Works")
})

test("token endpoint works", done => {
    request(app)
        .get('/')
        .expect(200, done)
})