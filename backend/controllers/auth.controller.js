import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
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

    // send email verification
    await sendVerificationEmail(user.email, verificationToken);

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
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: { ...user._doc, password: null },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "verifyEmail function fails: " + error.message,
    });
  }
};
export const login = async (req, res) => {
  // get email and password from user
  const { email, password } = req.body;

  try {
    // check if email exists
    const user = await User.findOne({ email });
    // if user does not exist
    if (!user) {
      return res.status(400).json({ message: "Error: User does not exist" });
    }
    // compare if the input password is the same as the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // if password is not the same
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Error: Wrong password" });
    }
    // if user does not exist and password is not the same
    if (!user && !isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Error: User does not exist and wrong password" });
    }

    // log in the user and update the lastLogin field
    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error(
      "login function fails (auth.controller.js line 121): ",
      error.message
    );
    res.status(400).json({
      success: false,
      message: "login function fails: " + error.message,
    });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("forgotPassword function fails: ", error.message);

    res.status(400).json({
      success: false,
      message: "forgotPassword function fails: " + error.message,
    });
  }
};
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    // clear reset token and expiry date
    user.resetpasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    // save the modified field to the database
    await user.save();
    // send success password reset email
    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("resetPassword function fails: ", error.message);
    res.status(400).json({
      success: false,
      message: "resetPassword function fails: " + error.message,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("checkAuth function fails: ", error.message);
    res.status(400).json({
      success: false,
      message: "checkAuth function fails: " + error.message,
    });
  }
};
