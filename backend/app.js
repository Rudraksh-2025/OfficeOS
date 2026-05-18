import express from "express";
import cors from "cors";
import authRoutes from './src/routes/auth.route.js'
import inviteRoutes from './src/routes/invite.routes.js'
import channelRoutes from './src/routes/channel.route.js'
import conversationRoutes from './src/routes/conversation.route.js'
import messageRoutes from './src/routes/message.route.js'
import userRoutes from './src/routes/users.route.js'

const app = express();

app.use(cors({
    origin: "http://localhost:3005",
    credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/invites", inviteRoutes);
app.use("/api/channel", channelRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/messages", messageRoutes)

app.get("/", (req, res) => {
    res.send("Hello World!");
})

export default app;