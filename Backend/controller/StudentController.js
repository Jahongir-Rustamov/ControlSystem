import Student from "../models/student.model.js";
import Grade from "../models/grades.model.js";

export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { firstName, lastName, groupId } = req.body;
    if (!studentId || !firstName || !lastName || !groupId) {
      return res.status(400).json({
        message: "Barcha maydonlarni to'ldiring",
      });
    }
    const user_id = req.user.UserId;
    const student = await Student.findOne({ group_id: groupId, user_id });

    if (!student) {
      return res.status(404).json({
        message: "Student topilmadi",
      });
    }

    student.students.forEach((student) => {
      if (student._id.toString() === studentId) {
        student.firstName = firstName;
        student.lastName = lastName;
      }
    });

    await student.save();

    res.status(200).json({
      message: "Student muvaffaqiyatli o'zgartirildi",
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addStudent = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { firstName, lastName } = req.body;
    const user_id = req.user.UserId;
    const student = await Student.findOne({ group_id: groupId, user_id });
    if (!student) {
      return res.status(404).json({
        message: "Student topilmadi",
      });
    }
    student.students.push({ firstName, lastName });
    await student.save();
    res.status(200).json({
      message: "Student muvaffaqiyatli qo'shildi",
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { groupId } = req.body;
    const user_id = req.user.UserId;

    const student = await Student.findOne({ group_id: groupId, user_id });
    if (!student) {
      return res.status(404).json({
        message: "Student topilmadi",
      });
    }

    student.students = student.students.filter(
      (student) => student._id.toString() !== studentId
    );
    await student.save();

    await Grade.updateMany(
      { group_id: groupId },
      { $pull: { "grades.$[].baholar": { student_id: studentId } } }
    );

    res.status(200).json({
      message: "Student muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const createGrades = async (req, res) => {
  try {
    const { groupId, subjectId, columnName, grades } = req.body;
    const user_id = req.user.UserId;

    // Barcha kerakli ma'lumotlarni tekshirish
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
      // Yangi baho hujjati yaratish
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
