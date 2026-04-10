import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['General', 'ICU', 'Private', 'Semi-Private', 'Emergency'],
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Full', 'Under Maintenance'],
      default: 'Available',
    },
    ratePerNight: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const roomModel = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default roomModel;
