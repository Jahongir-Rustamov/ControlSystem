import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const generateToken = (UserId, res) => {
  const accessToken = jwt.sign({ UserId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
  res.cookie("Control_students", accessToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.Node_Env !== "development",
  });
};

export default generateToken;
