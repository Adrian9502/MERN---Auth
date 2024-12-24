import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    // check if all fields are provided
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userAlreadyExists = await User.findOne({ email });
    // check if user already exists
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    // hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = generateVerificationToken();
    // create new user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hrs
    });

    await user.save(); // save user to database

    // jwt token
    generateTokenAndSetCookie(res, user._id);
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: {
        ...user._doc,
        password: null,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "signup function fails: " + error.message,
    });
  }
};

export const login = async (req, res) => {
  res.send("login route");
};

export const logout = async (req, res) => {
  res.send("logout route");
};

// resume video 38:58
