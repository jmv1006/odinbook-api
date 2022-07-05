import * as http from 'http';
import app from './app';

const server = http.createServer(app);

const PORT = 7000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});