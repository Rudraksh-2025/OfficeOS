import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./src/config/db.js";
import http from 'http';
import { initSocket } from "./src/sockets/socket.js";

dotenv.config();

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3003;

connectDB();

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});