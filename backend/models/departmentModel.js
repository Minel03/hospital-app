import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    head: {
      type: String,
      required: true,
      trim: true,
    },
    doctors: {
      type: Number,
      default: 0,
    },
    nurses: {
      type: Number,
      default: 0,
    },
    patients: {
      type: Number,
      default: 0,
    },
    beds: {
      type: Number,
      default: 0,
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const departmentModel =
  mongoose.models.department || mongoose.model('Department', departmentSchema);

export default departmentModel;
