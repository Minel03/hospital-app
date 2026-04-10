import { GlobalSettings, UserSettings } from '../models/settingsModel.js';

/* ================== GLOBAL SETTINGS ================== */
export const fetchPublicSettings = async (req, res) => {
  try {
    const settings = await GlobalSettings.findOne({}, 'hospitalName');
    res.json({ success: true, hospitalName: settings?.hospitalName || 'MediCare' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

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
    const userId = req.user.id;
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
    const userId = req.user.id;
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
    const userId = req.user.id;
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

/* ================== GET SETTINGS (GLOBAL + USER) ================== */
export const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    let globalSettings = await GlobalSettings.findOne();
    if (!globalSettings) {
      globalSettings = await GlobalSettings.create({
        hospitalName: process.env.VITE_APP_TITLE || 'My Hospital',
        address: '',
        contactNumber: '',
        email: '',
      });
    }

    let userSettings = await UserSettings.findOne({ user: userId });
    if (!userSettings) {
      userSettings = await UserSettings.create({ user: userId });
    }

    res.json({
      success: true,
      settings: {
        general: globalSettings,
        appearance: { theme: userSettings.theme },
        notifications: userSettings.notifications,
        emailSettings: userSettings.emailSettings,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================== UPDATE SETTINGS ================== */
export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const { general, appearance, notifications, emailSettings } = req.body;

    /* -------- Update Global Settings -------- */
    await GlobalSettings.findOneAndUpdate(
      {},
      {
        hospitalName: general.hospitalName,
        address: general.address,
        contactNumber: general.contactNumber,
        email: general.email,
      },
      { upsert: true, new: true },
    );

    /* -------- Update User Settings -------- */
    await UserSettings.findOneAndUpdate(
      { user: userId },
      {
        theme: appearance.theme,
        notifications,
        emailSettings,
      },
      { upsert: true, new: true },
    );

    res.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
