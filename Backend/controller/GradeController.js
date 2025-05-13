import Grade from "../models/grades.model.js";
import Student from "../models/student.model.js";

export const createGrades = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { subjectId, columnName, grades } = req.body;
    const user_id = req.user.UserId;
    console.log("groupId", groupId);
    console.log("subjectId", subjectId);
    console.log("columnName", columnName);
    console.log("grades", grades);

    if (!groupId || !subjectId || !columnName || !grades) {
      return res.status(400).json({
        message: "Barcha maydonlarni to'ldiring",
      });
    }

    // Talabalar mavjudligini tekshirish
    const student = await Student.findOne({ group_id: groupId, user_id });
    if (!student) {
      return res.status(404).json({
        message: "Guruh topilmadi",
      });
    }

    // Baholarni formatlash
    const formattedGrades = grades.map((grade) => ({
      student_id: grade.studentId,
      grade: grade.value,
    }));

    // Mavjud baholarni tekshirish
    let gradeDoc = await Grade.findOne({
      group_id: groupId,
      subject_id: subjectId,
    });

    if (gradeDoc) {
      // Agar ustun mavjud bo'lsa, uni yangilash
      const columnIndex = gradeDoc.grades.findIndex(
        (col) => col.columnName === columnName
      );

      if (columnIndex !== -1) {
        // Mavjud ustunni yangilash
        gradeDoc.grades[columnIndex].baholar = formattedGrades;
      } else {
        // Yangi ustun qo'shish
        gradeDoc.grades.push({
          columnName,
          baholar: formattedGrades,
        });
      }
    } else {
      gradeDoc = new Grade({
        group_id: groupId,
        subject_id: subjectId,
        grades: [
          {
            columnName,
            baholar: formattedGrades,
          },
        ],
      });
    }

    await gradeDoc.save();

    res.status(200).json({
      message: "Baholar muvaffaqiyatli saqlandi",
      data: gradeDoc,
    });
  } catch (error) {
    console.error("Error creating grades:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getGrades = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { subjectId } = req.query;
    console.log("groupIdlar", groupId);
    console.log("subjectIdlar", subjectId);
    if (!groupId || !subjectId) {
      return res.status(400).json({
        message: "Barcha maydonlarni to'ldiring",
      });
    }
    const grades = await Grade.findOne({
      group_id: groupId,
      subject_id: subjectId,
    });
    if (!grades) {
      return res.status(404).json({
        message: "Bu guruh bu fan bo'yicha baholanmagan",
      });
    }
    console.log("grades", grades);
    res.status(200).json(grades);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching grades" });
  }
};

export const deleteColumn = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { subjectId, columnName } = req.body;
    console.log("groupId", groupId);
    console.log("subjectId", subjectId);
    console.log("columnName", columnName);

    if (!groupId || !subjectId || !columnName) {
      return res.status(400).json({
        message: "Barcha maydonlarni to'ldiring",
      });
    }

    const gradeDoc = await Grade.findOne({
      group_id: groupId,
      subject_id: subjectId,
    });

    if (!gradeDoc) {
      return res.status(404).json({
        message: "Bu guruh bu fan bo'yicha baholanmagan",
      });
    }

    const columnIndex = gradeDoc.grades.findIndex(
      (col) => col.columnName === columnName
    );

    if (columnIndex === -1) {
      return res.status(404).json({
        message: "Bu ustun topilmadi",
      });
    }

    gradeDoc.grades.splice(columnIndex, 1);
    await gradeDoc.save();

    res.status(200).json({
      message: "Ustun muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting column" });
  }
};
