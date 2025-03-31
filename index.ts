import express from "express";
import cors from "cors";
// import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import blogRoutes from "./routes/blogRoutes"
dotenv.config();
const app = express();

app.use(cors({
    origin: [ "https://splendid-bublanina-1c35e9.netlify.app", "http://localhost:5173","http://localhost:5173/blog/post"],     
  }));
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/blogs", blogRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
