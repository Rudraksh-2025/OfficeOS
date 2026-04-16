import express from "express";
import cors from "cors";
import authRoutes from './src/routes/auth.route.js'

const app = express();

app.use(cors({
    origin: "http://localhost:5000",
    credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
    res.send("Hello World!");
})

export default app;