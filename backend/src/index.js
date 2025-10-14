import express from "express";
import cookieParser from "cookie-parser";
import { ENV } from "./lib/env.js";
import path from 'path';
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./config/db.js";


const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 2002;

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

// Make ready for deployment
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname), "../frontend/dist/index.html")
    })
}

app.listen(PORT, () => {
    connectDB(),
    console.log(`Server is running on port http://localhost:${PORT}`);
})