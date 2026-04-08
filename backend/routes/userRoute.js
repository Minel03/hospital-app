import express from 'express';
import {
  addUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  loginUser,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/add', addUser);
userRouter.put('/update', updateUser);
userRouter.get('/all', getAllUsers);
userRouter.post('/single', getUserById);
userRouter.delete('/delete', deleteUser);
userRouter.post('/login', loginUser);

export default userRouter;
