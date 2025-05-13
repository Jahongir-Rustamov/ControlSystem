import express from "express";
import { ProtectRoute } from "../middleware/ProtectRoute.js";
import { getGrades } from "../controller/GradeController.js";
import { createGrades } from "../controller/GradeController.js";
import { deleteColumn } from "../controller/GradeController.js";
const router = express.Router();

router.get("/:groupId", ProtectRoute, getGrades);

router.post("/create-grades/:groupId", ProtectRoute, createGrades);

router.get("/get-grades/:groupId", ProtectRoute, getGrades);

router.delete("/delete-column/:groupId", ProtectRoute, deleteColumn);

export default router;
