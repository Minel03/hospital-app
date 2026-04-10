import express from 'express';
import {
  addUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  loginUser,
} from '../controllers/userController.js';
import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// Public route
userRouter.post('/login', loginUser);

// Protected routes (Admin only for user management)
userRouter.use(authUser);
userRouter.use(restrictTo('admin'));

userRouter.post('/add', addUser);
userRouter.put('/update', updateUser);
userRouter.get('/all', getAllUsers);
userRouter.post('/single', getUserById);
userRouter.delete('/delete', deleteUser);

export default userRouter;
