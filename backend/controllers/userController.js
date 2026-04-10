import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createLog } from './auditLogController.js';

/* =========================================================
   HELPER: CREATE JWT
========================================================= */
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );
};

/* =========================================================
   ADD USER
========================================================= */
export const addUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, department } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      department,
    });
    await user.save();

    await createLog({
      entity: 'User',
      entityId: user._id,
      action: 'User Added',
      details: `User ${name} was added to the system.`,
    });

    res.json({ success: true, message: 'User added successfully', user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   LOGIN USER
========================================================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(user);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   UPDATE USER
========================================================= */
export const updateUser = async (req, res) => {
  try {
    const { userId, name, email, role, phone, department, password } = req.body;

    if (!userId)
      return res.json({ success: false, message: 'User ID is required' });

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: 'User not found' });

    const updateData = { name, email, role, phone, department };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    let token = null;
    if (req.user && req.user.id === userId) {
      token = createToken(updatedUser);
    }

    await createLog({
      entity: 'User',
      entityId: updatedUser._id,
      action: 'User Updated',
      details: `User ${updatedUser.name} was updated.`,
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   GET ALL USERS
========================================================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   GET USER BY ID
========================================================= */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return res.json({ success: false, message: 'User ID is required' });

    const user = await userModel.findById(userId).select('-password');
    if (!user) return res.json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   DELETE USER
========================================================= */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return res.json({ success: false, message: 'User ID is required' });

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: 'User not found' });

    await userModel.findByIdAndDelete(userId);

    await createLog({
      entity: 'User',
      entityId: userId,
      action: 'User Deleted',
      details: `User ${user.name} was deleted from the system.`,
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
