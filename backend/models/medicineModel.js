import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
    },
    brand: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Other'],
      default: 'Tablet',
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    manufacturer: String,
    description: String,
  },
  { timestamps: true },
);

const medicineModel =
  mongoose.models.Medicine || mongoose.model('Medicine', medicineSchema);

export default medicineModel;
