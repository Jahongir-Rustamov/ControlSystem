import express from "express";
import {
  CreateSubject,
  DeleteSubject,
  GetAllSubjects,
} from "../controller/CreateSubjectController.js";
import { ProtectRoute } from "../middleware/ProtectRoute.js";

const router = express.Router();

router.post("/create/:id", ProtectRoute, CreateSubject);

router.get("/get_all_subject", ProtectRoute, GetAllSubjects);

router.delete("/delete/subject/:id", ProtectRoute, DeleteSubject);

export default router;
