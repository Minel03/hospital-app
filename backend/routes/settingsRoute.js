import express from 'express';
import {
  fetchGlobalSettings,
  saveGlobalSettings,
  fetchUserSettings,
  saveUserSettings,
  saveUserNotifications,
} from '../controllers/settingsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const settingsRouter = express.Router();

// GLOBAL SETTINGS (admin only)
settingsRouter.get('/global', authMiddleware, fetchGlobalSettings);
settingsRouter.put('/global', authMiddleware, saveGlobalSettings);

// USER SETTINGS (per logged-in user)
settingsRouter.get('/user', authMiddleware, fetchUserSettings);
settingsRouter.put('/user', authMiddleware, saveUserSettings);
settingsRouter.put(
  '/user/notifications',
  authMiddleware,
  saveUserNotifications,
);

export default settingsRouter;
