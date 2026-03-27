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
});

const doctorModel =
  mongoose.models.doctor || mongoose.model('doctor', doctorSchema);

export default doctorModel;
