import express from "express";
import {
  CheckAuthUser,
  LoginUser,
  LogoutUser,
  SignUpUser,
} from "../controller/AuthController.js";
import { ProtectRoute } from "../middleware/ProtectRoute.js";
const router = express.Router();

router.post("/signup", SignUpUser);

router.post("/login", LoginUser);

router.delete("/logout", LogoutUser);

router.get("/checkauth", ProtectRoute, CheckAuthUser);

export default router;
