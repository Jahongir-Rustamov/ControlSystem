import Grade from "../models/grades.model.js";
import Subject from "../models/subject.model.js";
import Group from "../models/groups.model.js";
import Student from "../models/student.model.js";

export const CreateSubject = async (req, res) => {
  try {
    const { subjectName } = req.body;
    const { id } = req.params;
    console.log(id);
    console.log(subjectName);
    if (!subjectName) {
      return res.status(400).json({ message: "Fan nomini kiritish zarur" });
    }
    const newSubject = await Subject({
      subjectName: subjectName.toUpperCase(),
      user_id: id,
    });
    const sub = await newSubject.save();
    res.status(201).json(sub);
  } catch (error) {
    console.error("Error creating subject controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const GetAllSubjects = async (req, res) => {
  try {
    const user_id = req.user.UserId;
    const getAllSub = await Subject.find({ user_id: user_id })
      .populate("groups._id", "groupName _id")
      .sort({ createdAt: -1 });
    res.status(200).json(getAllSub);
  } catch (error) {
    console.error("Error GetAllSubjects Controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const DeleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubject = await Subject.findByIdAndDelete(id);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Fan topilmadi" });
    }

    // Agar fan o'chirilsa, unga tegishli guruhlarni va talabalarni o'chirish
    if (deletedSubject.groups && deletedSubject.groups.length > 0) {
      try {
        // Parallel ravishda barcha guruhlarni va ularga bog'langan talabalarni o'chirish
        await Promise.all(
          deletedSubject.groups.map(async (gr) => {
            // Guruhga bog'langan baholarni o'chirish
            await Grade.deleteMany({ group_id: gr._id });
          })
        );
      } catch (error) {
        console.error("Error deleting groups or students:", error);
        return res.status(500).json({
          message: "Guruhlar yoki talabalarni o'chirishda xatolik yuz berdi",
        });
      }
    }

    res.status(200).json({ message: "Fan, guruhlar va talabalar o'chirildi" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
