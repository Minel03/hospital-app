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
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Pending', 'Cancelled'],
    default: 'Pending',
  },
  type: {
    type: String,
    enum: ['Check-up', 'Consultation', 'Follow-up'],
    default: 'Check-up',
  },
  department: {
    type: String,
    required: true,
  },
});

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model('appointment', appointmentSchema);

export default appointmentModel;
