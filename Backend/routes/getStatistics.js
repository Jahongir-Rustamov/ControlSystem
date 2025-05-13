import express from "express";
import { ProtectRoute } from "../middleware/ProtectRoute.js";
import Subject from "../models/subject.model.js";
import Group from "../models/groups.model.js";
import Student from "../models/student.model.js";

const router = express.Router();

router.get("/", ProtectRoute, async (req, res) => {
  try {
    const user_id = req.user.UserId;
    const subject = await Subject.countDocuments({ user_id: user_id });
    const groups = await Group.countDocuments({ user_id: user_id });
    const studentss = await Student.find({ user_id: user_id });
    const studentsCount = studentss.reduce(
      (acc, student) => acc + student.students.length,
      0
    );

    res.status(200).json({ subject, groups, students: studentsCount });
  } catch (error) {
    console.error("Error getStatistics:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});
export default router;
