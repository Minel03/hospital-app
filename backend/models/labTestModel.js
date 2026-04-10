import mongoose from 'mongoose';

const labTestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Test name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Blood', 'Urine', 'Imaging', 'Pathology', 'Neurology', 'Other'],
      default: 'Blood',
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    normalRange: {
      type: String,
      default: 'N/A',
    },
    unit: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const labTestModel =
  mongoose.models.LabTest || mongoose.model('LabTest', labTestSchema);

export default labTestModel;
