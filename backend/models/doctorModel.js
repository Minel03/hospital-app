import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  patients: {
    type: Number,
  },
  rating: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'Available',
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
});

const doctorModel =
  mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

export default doctorModel;
