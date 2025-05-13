import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const ProtectRoute = (req, res, next) => {
  try {
    const token = req.cookies["Control_students"];
    if (!token) {
      return res.status(401).json({ message: "Siz tizimga kirmagansiz ‼️" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    req.user = decode;
    next();
  } catch (error) {
    console.log("Error with protectRoute Middleware:", error.message);
    res.status(500).json({ message: "Serverda xatolik yuz berdi ❌" });
  }
};
