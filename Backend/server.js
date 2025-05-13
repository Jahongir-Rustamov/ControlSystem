import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import AuthSections from "./routes/AuthRoute.js";
import CreateSubject from "./routes/CreateSubjectRoute.js";
import connectDB from "./DB/connectDB.js";
import CreateGroup from "./routes/GroupRoute.js";
import getStatistics from "./routes/getStatistics.js";
import Students from "./routes/StudentRoute.js";
import Grades from "./routes/GradesRoute.js";
import cors from "cors";
import path from "path";

const app = express();
config();

// CORS sozlamalari
const corsOptions = {
  origin:
    process.env.Node_Env === "production"
      ? process.env.FRONTEND_URL // production uchun
      : "http://localhost:5173", // development uchun
  credentials: true,
};

if (process.env.Node_Env === "production") {
  app.use(express.static(path.join(__dirname, "/Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
  });
}
app.use(cors(corsOptions));
const __dirname = path.resolve();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", AuthSections);
app.use("/api/subjects", CreateSubject);
app.use("/api/groups", CreateGroup);
app.use("/api/getStatistics", getStatistics);
app.use("/api/students", Students);
app.use("/api/grades", Grades);

const port = process.env.port || 5000;
app.listen(port, () => {
  connectDB();
  console.log(`Server running on port :${port}`);
});
