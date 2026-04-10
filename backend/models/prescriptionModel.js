import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    items: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Medicine',
          required: true,
        },
        dosage: {
          type: String, // e.g. "1-0-1" or "5ml after food"
          required: true,
        },
        duration: {
          type: String, // e.g. "5 days"
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    diagnosis: String,
    notes: String,
    status: {
      type: String,
      enum: ['Pending', 'Dispensed', 'Cancelled'],
      default: 'Pending',
    },
    dispensedAt: Date,
  },
  { timestamps: true },
);

const prescriptionModel =
  mongoose.models.Prescription ||
  mongoose.model('Prescription', prescriptionSchema);

export default prescriptionModel;
