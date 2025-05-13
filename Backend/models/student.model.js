import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  students: [
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
  ],
});

const Student = mongoose.model("Student", StudentSchema);

export default Student;
