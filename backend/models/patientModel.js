import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },

    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: 0,
    },

    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: [true, 'Address is required'],
    },

    bloodType: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },

    allergies: {
      type: String,
      default: 'None',
    },

    medicalHistory: {
      type: String,
      default: 'None',
    },

    lastVisit: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true },
);

const Patient =
  mongoose.models.Patient || mongoose.model('Patient', patientSchema);

export default Patient;
