import express from "express";
import {
  CreateGroup,
  deleteGroup,
  getAllGroups,
  getStudentsInGroup,
} from "../controller/GroupController.js";
import { ProtectRoute } from "../middleware/ProtectRoute.js";
import multer from "multer";

const router = express.Router();

// Multer konfiguratsiyasi
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Faqat Excel fayllar (.xlsx) yuklanishi mumkin"), false);
    }
  },
});

router.post(
  "/create/:subjectId",
  ProtectRoute,
  upload.single("exelFile"),
  CreateGroup
);
router.get("/", ProtectRoute, getAllGroups);

router.get("/students/:groupId", ProtectRoute, getStudentsInGroup);

router.delete("/:groupId", ProtectRoute, deleteGroup);

export default router;
