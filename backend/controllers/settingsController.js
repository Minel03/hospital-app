import { GlobalSettings, UserSettings } from '../models/settingsModel.js';

/* ================== GLOBAL SETTINGS ================== */
export const fetchGlobalSettings = async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      // create default if not exists
      settings = await GlobalSettings.create({
        hospitalName: process.env.VITE_APP_TITLE || 'My Hospital',
        address: '',
        contactNumber: '',
        email: '',
      });
    }
    res.json({ success: true, settings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveGlobalSettings = async (req, res) => {
  try {
    const { hospitalName, address, contactNumber, email } = req.body;
    const settings = await GlobalSettings.findOneAndUpdate(
      {},
      { hospitalName, address, contactNumber, email },
      { new: true, upsert: true },
    );
    res.json({ success: true, settings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================== USER SETTINGS ================== */
export const fetchUserSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    let settings = await UserSettings.findOne({ user: userId });
    if (!settings) {
      settings = await UserSettings.create({ user: userId });
    }
    res.json({ success: true, settings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveUserSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { theme, notifications, emailSettings } = req.body;

    const settings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { theme, notifications, emailSettings },
      { new: true, upsert: true },
    );

    res.json({ success: true, settings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notifications } = req.body;

    const settings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { notifications },
      { new: true, upsert: true },
    );

    res.json({ success: true, settings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
