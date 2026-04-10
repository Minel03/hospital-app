import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        'admin',
        'doctor',
        'nurse',
        'pharmacist',
        'medtech',
        'receptionist',
        'accountant',
        'staff',
      ],
      default: 'staff',
    },

    phone: {
      type: String,
      default: '',
    },

    department: {
      type: String,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Link to Settings (user-specific settings)
    settings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Settings',
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;
