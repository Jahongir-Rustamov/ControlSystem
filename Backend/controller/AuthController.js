import generateToken from "../generateToken/generate_token.js";
import User from "../models/auth.model.js";
import bcryptjs from "bcryptjs";

export const SignUpUser = async (req, res) => {
  try {
    const { username, firstName, lastName, password } = req.body;

    if (!username || !firstName || !lastName || !password) {
      return res.status(400).json("Iltimis, barcha maydonlarni to'ldiring.");
    }

    const user = await User.findOne({ username }).select("-password -__v");

    if (user) {
      return res
        .status(400)
        .json({ message: "Foydalanuvchi ro'yhatdan o'tgan ❎" });
    }

    const newUser = await User({
      username,
      firstName,
      lastName,
      password,
    });

    const salt = await bcryptjs.genSalt(10);
    newUser.password = await bcryptjs.hash(password, salt);
    const user01 = await newUser.save();
    // Generate Token here
    generateToken(user01._id, res);
    res.status(201).json(user01);
  } catch (error) {
    console.log("Error in Signup:", error.message);
    res.status(500).json({ message: "Serverda xatolik yuz berdi ❌" });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json("Iltimos, barcha maydonlarni to'ldiring.");
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json("Foydalanuvchi topilmadi ❌");
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json("Parol xato ❌");
    }
    generateToken(user._id, res);
    // Generate Token here

    res.status(200).json({
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.log("Error in Login:", error.message);
    res.status(500).json({ message: "Serverda xatolik yuz berdi ❌" });
  }
};

export const LogoutUser = async (req, res) => {
  try {
    res.clearCookie("Control_students");
    res.status(200).json({ message: "Muaffaqiyatli saytdan chiqdingiz 🎉" });
  } catch (error) {
    console.log("Error in Logout:", error.message);
    res.status(500).json({ message: "Serverda xatolik yuz berdi ❌" });
  }
};

export const CheckAuthUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.UserId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi ❌" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in CheckAuthUser:", error.message);
    res.status(500).json({ message: "Serverda xatolik yuz berdi ❌" });
  }
};
