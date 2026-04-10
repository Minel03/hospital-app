import mongoose from 'mongoose';

const labReportSchema = new mongoose.Schema(
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
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LabTest',
      required: true,
    },
    status: {
      type: String,
      enum: ['Ordered', 'Sample Collected', 'Processing', 'Completed', 'Cancelled'],
      default: 'Ordered',
    },
    resultValue: {
      type: String, // Can be a string, number, or JSON-like string
      default: '',
    },
    findings: {
      type: String,
      default: '',
    },
    normalRangeSnapshot: String, // Store normal range at time of test
    reportAttached: {
      type: String, // URL/Path to PDF or image if uploaded
      default: '',
    },
    completedAt: Date,
  },
  { timestamps: true },
);

const labReportModel =
  mongoose.models.LabReport || mongoose.model('LabReport', labReportSchema);

export default labReportModel;
