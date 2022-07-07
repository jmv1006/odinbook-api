import * as http from 'http';
import app from './app';
import { Server } from 'socket.io';

const server = http.createServer(app);

export const io = new Server(server, {
    cors: { origin: "*" }
});

import './config/socket-io/socket-io-config';

const PORT = 7000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});