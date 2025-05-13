import xlsx from "xlsx";
import Group from "../models/groups.model.js";
import Subject from "../models/subject.model.js";
import Student from "../models/student.model.js";
import Grade from "../models/grades.model.js";

export const CreateGroup = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const user_id = req.user.UserId;
    const { subjectId } = req.params;

    if (!req.body) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const { groupName, existingGroupId } = req.body;
    const exelFile = req.file;

    if (!existingGroupId) {
      if (!groupName) {
        return res.status(400).json({ message: "groupName aniqlanmadi" });
      }

      if (!exelFile) {
        return res.status(400).json({ message: "Excel fayl yuklanmadi" });
      }

      // Excel faylni o'qish
      const workbook = xlsx.read(exelFile.buffer, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet);

      // Talabalar ma'lumotlarini tekshirish va filtrlash
      const students = data
        .map((row) => {
          if (!row.firstName || !row.lastName) {
            return null;
          }
          return {
            firstName: row.firstName.trim(),
            lastName: row.lastName.trim(),
          };
        })
        .filter((student) => student !== null); // Bo'sh ma'lumotlarni olib tashlash

      if (students.length === 0) {
        return res.status(400).json({
          message: "Excel faylda to'g'ri talabalar ma'lumotlari topilmadi ‼️",
        });
      }

      const group = await Group.create({ groupName, user_id });

      await Subject.findByIdAndUpdate(
        subjectId,
        {
          $push: { groups: { _id: group._id } },
        },
        { new: true }
      );

      await Student.create({
        user_id,
        group_id: group._id,
        students,
      });

      res.status(201).json({
        message: "Guruh va talabalar muvaffaqiyatli yaratildi",
        data: {
          studentsCount: students.length,
        },
      });
    } else {
      await Subject.findByIdAndUpdate(
        subjectId,
        {
          $push: { groups: { _id: existingGroupId } },
        },
        { new: true }
      );

      const studentCount = await Student.findOne({
        group_id: existingGroupId,
      });
      const count = studentCount.students.length;
      res.status(200).json({
        message: "Mavjud guruh muvaffaqiyatli qo'shildi",
        data: {
          studentsCount: count,
        },
      });
    }
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({ user_id: req.user.UserId });
    const students = await Student.find({ user_id: req.user.UserId });

    const groupWithStudentCount = groups.map((group) => {
      const studentDoc = students.find(
        (student) => String(student.group_id) === String(group._id)
      );

      const count = studentDoc ? studentDoc.students.length : 0;
      return { ...group.toObject(), studentCount: count };
    });

    res.status(200).json(groupWithStudentCount);
  } catch (error) {
    console.error("Error getting groups:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getStudentsInGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const user_id = req.user.UserId;

    const students = await Student.find({
      user_id: user_id,
      group_id: groupId,
    });

    res.status(200).json(students);
  } catch (error) {
    console.error("Error getting students in group:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const subjectid = req.query.subjectId;
    console.log("jafar", subjectid, groupId);
    if (!subjectid) {
      return res.status(400).json({ message: "Subject ID is required" });
    }

    const subject = await Subject.findByIdAndUpdate(
      subjectid,
      { $pull: { groups: { _id: groupId } } },
      { new: true }
    );

    await Grade.deleteMany({ subject_id: subjectid, group_id: groupId });
    console.log(subject);

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
