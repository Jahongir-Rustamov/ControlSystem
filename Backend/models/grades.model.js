import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: [true, "Group ID is required"],
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject ID is required"],
    },
    grades: [
      {
        columnName: {
          type: String,
          required: true,
        },
        baholar: [
          {
            student_id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Student",
              required: [true, "Student ID is required"],
            },
            grade: {
              type: Number,
              required: [true, "Grade is required"],
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Grade = mongoose.model("Grade", Schema);

export default Grade;
