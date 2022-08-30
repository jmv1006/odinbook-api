import * as http from "http";
import app from "./app";
import { Server } from "socket.io";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" },
});

import "./config/socket-io/socket-io-config";

const PORT = process.env.PORT || 7000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
