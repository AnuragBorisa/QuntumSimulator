import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Student from '../models/Student.js';
import nodemailer from 'nodemailer';

// Helper function to generate JWT token
const generateToken = (user, res) => {
  const payload = { user: { id: user.id, role: user.role } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({
    token,
    userId: user.id,
    role: user.role, // Include role in response
  });
};

// Register a new student
export const registerStudent = async (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  try {
    let student = await Student.findOne({ where: { email } });
    if (student) {
      return res.status(400).json({ msg: "Student already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    student = await Student.create({ name, email, password: hashPassword, role: 'student' });

    generateToken(student, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashPassword, role: 'user' });

    generateToken(user, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Login for both student and user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in either Student or User table
    let user = await Student.findOne({ where: { email } });
    if (!user) {
      user = await User.findOne({ where: { email } });
    }

    // If user not found, return error
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Generate token with the correct role and id
    generateToken(user, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Forgot password logic
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Student.findOne({ where: { email } }) || await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      html: `<p>You requested a password reset</p>
             <p>Click this <a href="http://localhost:8080/api/auth/reset/${token}">link</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: "Email sent" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Verify password reset token
export const verifyToken = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: decoded.id });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: "Password reset token is invalid or has expired" });
  }
};

// Update password after resetting
export const updatePassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Student.findOne({ where: { id: decoded.id } }) || await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: "Password reset token is invalid or has expired" });
  }
};
