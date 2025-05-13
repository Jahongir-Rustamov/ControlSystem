import express from "express";
import { ProtectRoute } from "../middleware/ProtectRoute.js";
import {
  updateStudent,
  addStudent,
  deleteStudent,
} from "../controller/StudentController.js";

const router = express.Router();

router.patch("/:studentId", ProtectRoute, updateStudent);

router.post("/add/:groupId", ProtectRoute, addStudent);

router.delete("/:studentId", ProtectRoute, deleteStudent);


export default router;
