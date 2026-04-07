import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
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
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Pending', 'Cancelled'],
    default: 'Pending',
  },
  type: {
    type: String,
    enum: ['Check-up', 'Consultation', 'Follow-up', 'Emergency'],
    default: 'Check-up',
  },
});

const appointmentModel =
  mongoose.models.Appointment ||
  mongoose.model('Appointment', appointmentSchema);

export default appointmentModel;
