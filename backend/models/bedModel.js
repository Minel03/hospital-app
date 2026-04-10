import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },

    bedNumber: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Under Maintenance'],
      default: 'Available',
    },

    currentPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },
  },
  { timestamps: true },
);

const bedModel = mongoose.models.Bed || mongoose.model('Bed', bedSchema);

export default bedModel;
