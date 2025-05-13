import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "Name is required"],
    },
    lastName: {
      required: true,
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is requried"],
      minlength: [6, "Password must be at least 6 characters long"],
      trim: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", Schema);

export default User;
