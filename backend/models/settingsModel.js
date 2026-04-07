import mongoose from 'mongoose';

const globalSettingsSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String },
    email: { type: String },
  },
  { timestamps: true },
);

const userSettingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light',
    },
    notifications: {
      email: { type: Boolean, default: true },
      appointment: { type: Boolean, default: true },
      emergency: { type: Boolean, default: false },
      updates: { type: Boolean, default: false },
    },
    emailSettings: {
      smtpHost: { type: String, default: '' },
      smtpPort: { type: Number, default: 587 },
      smtpUser: { type: String, default: '' },
      smtpPass: { type: String, default: '' },
      fromEmail: { type: String, default: '' },
    },
  },
  { timestamps: true },
);

const GlobalSettings =
  mongoose.models.GlobalSettings ||
  mongoose.model('GlobalSettings', globalSettingsSchema);

const UserSettings =
  mongoose.models.UserSettings ||
  mongoose.model('UserSettings', userSettingsSchema);

export { GlobalSettings, UserSettings };
