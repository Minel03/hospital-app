// models/invoiceModel.js
import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    admission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admission',
      default: null,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    services: [
      {
        name: {
          type: String,
          enum: [
            'Consultation',
            'Surgery',
            'Laboratory',
            'Imaging',
            'Pharmacy',
            'Room & Board',
            'Emergency',
          ],
          required: true,
        },
        amount: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Draft', 'Paid', 'Pending', 'Overdue'],
      default: 'Pending',
    },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true },
);

const invoiceModel =
  mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
export default invoiceModel;
