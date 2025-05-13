import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    groups: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Group",
        },
      },
    ],
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", Schema);
export default Subject;
