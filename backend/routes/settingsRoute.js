import express from 'express';
import {
  fetchPublicSettings,
  fetchGlobalSettings,
  saveGlobalSettings,
  fetchUserSettings,
  saveUserSettings,
  saveUserNotifications,
} from '../controllers/settingsController.js';
import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const settingsRouter = express.Router();

// PUBLIC SETTINGS
settingsRouter.get('/public', fetchPublicSettings);

// GLOBAL SETTINGS (admin only)
settingsRouter.get('/global', authUser, restrictTo('admin'), fetchGlobalSettings);
settingsRouter.put('/global', authUser, restrictTo('admin'), saveGlobalSettings);

// USER SETTINGS (per logged-in user)
settingsRouter.get('/user', authUser, fetchUserSettings);
settingsRouter.put('/user', authUser, saveUserSettings);
settingsRouter.put(
  '/user/notifications',
  authUser,
  saveUserNotifications,
);

export default settingsRouter;
