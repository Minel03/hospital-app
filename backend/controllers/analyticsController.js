import invoiceModel from '../models/invoiceModel.js';
import bedModel from '../models/bedModel.js';
import patientModel from '../models/patientModel.js';
import appointmentModel from '../models/appointmentModel.js';
import departmentModel from '../models/departmentModel.js';
import admissionModel from '../models/admissionModel.js';

export const getDashboardSummary = async (req, res) => {
  try {
    // 1. Revenue Analytics (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueData = await invoiceModel.aggregate([
      {
        $match: {
          status: 'Paid',
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // 2. Bed Occupancy
    const bedStats = await bedModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // 3. Appointment Stats
    const appointmentStats = await appointmentModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // 4. Patient Demographics (Age groups)
    const patientDemographics = await patientModel.aggregate([
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 18, 35, 50, 65, 100],
          default: 'Other',
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    // 5. Department Distribution (Dynamically calculate load)
    const [departments, activeAdmissions] = await Promise.all([
      departmentModel.find({}, 'name color'),
      admissionModel.find({ status: 'Admitted' }, 'department'),
    ]);

    const departmentDistribution = departments.map((dept) => {
      const load = activeAdmissions.filter(
        (a) => a.department?.toString() === dept._id.toString()
      ).length;
      return {
        name: dept.name,
        patients: load,
        color: dept.color,
      };
    });

    const boundaries = [0, 18, 35, 50, 65, 100];
    const boundariesMap = {
      0: '0-17',
      18: '18-34',
      35: '35-49',
      50: '50-64',
      65: '65+',
    };

    const formattedDemographics = patientDemographics.map((d) => ({
      range: boundariesMap[d._id] || 'Other',
      count: d.count,
    }));

    res.json({
      success: true,
      data: {
        revenue: revenueData.map((d) => ({
          month: new Date(d._id.year, d._id.month - 1).toLocaleString('default', {
            month: 'short',
          }),
          amount: d.total,
        })),
        beds: {
          available: bedStats.find((b) => b._id === 'Available')?.count || 0,
          occupied: bedStats.find((b) => b._id === 'Occupied')?.count || 0,
          maintenance: bedStats.find((b) => b._id === 'Under Maintenance')?.count || 0,
        },
        appointments: {
          confirmed: appointmentStats.find((a) => a._id === 'Confirmed')?.count || 0,
          pending: appointmentStats.find((a) => a._id === 'Pending')?.count || 0,
          cancelled: appointmentStats.find((a) => a._id === 'Cancelled')?.count || 0,
        },
        demographics: formattedDemographics,
        departments: departmentDistribution
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getAdvancedStats = async (req, res) => {
    // Placeholder for more detailed stats if needed later
    res.json({ success: true, message: "Advanced stats endpoint" });
}
