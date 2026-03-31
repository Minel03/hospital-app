import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    roomsAndBeds: { type: Number, default: 0 }, // ← renamed
    phone: { type: String, trim: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

const departmentModel =
  mongoose.models.Department || mongoose.model('Department', departmentSchema);

export default departmentModel;
