import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const corsOptions = {
  origin: process.env.FRONT_END_URL,
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    dbName: "MEMORIES-REACT",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))
  )
  .catch((error) => console.log(error.message));
