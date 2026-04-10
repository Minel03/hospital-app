import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

// Models
import { GlobalSettings } from './models/settingsModel.js';
import Department from './models/departmentModel.js';
import Room from './models/roomModel.js';
import Bed from './models/bedModel.js';
import Medicine from './models/medicineModel.js';
import LabTest from './models/labTestModel.js';
import Patient from './models/patientModel.js';
import User from './models/userModel.js';
import Doctor from './models/doctorModel.js';
import Staff from './models/staffModel.js';
import Appointment from './models/appointmentModel.js';
import Admission from './models/admissionModel.js';
import LabReport from './models/labReportModel.js';
import Prescription from './models/prescriptionModel.js';
import Invoice from './models/invoiceModel.js';
import AuditLog from './models/auditLogModel.js';

dotenv.config();

const seedDB = async () => {
  try {
    console.log('--- Database Seeding Started ---');

    await mongoose.connect(`${process.env.MONGODB_URI}/hospital`);
    console.log('Connected to MongoDB');

    // 1. Clear Existing Data
    const models = [
      GlobalSettings,
      Department,
      Room,
      Bed,
      Medicine,
      LabTest,
      Patient,
      User,
      Doctor,
      Staff,
      Appointment,
      Admission,
      LabReport,
      Prescription,
      Invoice,
      AuditLog,
    ];

    for (const model of models) {
      await model.deleteMany({});
      console.log(`Cleared ${model.modelName || 'collection'}`);
    }

    console.log('\n--- Phase 1: Base Data ---');

    await GlobalSettings.create({
      hospitalName: 'Medicare Center',
      address: '777 Healthcare Ave, Metro City',
      contactNumber: '+1 234 567 8900',
      email: 'contact@grandmedicare.com',
    });
    console.log('Seeded Settings');

    // Pre-generate IDs for circular references
    const deptIds = Array.from({ length: 5 }).map(
      () => new mongoose.Types.ObjectId(),
    );
    const doctorIds = Array.from({ length: 5 }).map(
      () => new mongoose.Types.ObjectId(),
    );
    const userIds = Array.from({ length: 10 }).map(
      () => new mongoose.Types.ObjectId(),
    );

    // Departments
    const deptsData = [
      {
        _id: deptIds[0],
        name: 'Cardiology',
        head: doctorIds[0],
        description: 'Heart health unit',
        status: 'Active',
        roomsAndBeds: 2,
        color: '#ef4444',
      },
      {
        _id: deptIds[1],
        name: 'Pediatrics',
        head: doctorIds[1],
        description: 'Child care unit',
        status: 'Active',
        roomsAndBeds: 2,
        color: '#3b82f6',
      },
      {
        _id: deptIds[2],
        name: 'Neurology',
        head: doctorIds[2],
        description: 'Brain & Spine',
        status: 'Active',
        roomsAndBeds: 1,
        color: '#8b5cf6',
      },
      {
        _id: deptIds[3],
        name: 'Oncology',
        head: doctorIds[3],
        description: 'Cancer unit',
        status: 'Active',
        roomsAndBeds: 1,
        color: '#ec4899',
      },
      {
        _id: deptIds[4],
        name: 'Orthopedics',
        head: doctorIds[4],
        description: 'Bone unit',
        status: 'Active',
        roomsAndBeds: 2,
        color: '#10b981',
      },
    ];
    await Department.insertMany(deptsData);
    console.log(`Seeded 5 Departments`);

    // Rooms
    const roomsData = [
      {
        roomNumber: '101',
        type: 'General',
        floor: 1,
        ratePerNight: 150,
        capacity: 4,
        department: deptIds[0],
        status: 'Available',
      },
      {
        roomNumber: '102',
        type: 'Semi-Private',
        floor: 1,
        ratePerNight: 250,
        capacity: 2,
        department: deptIds[1],
        status: 'Available',
      },
      {
        roomNumber: '201',
        type: 'Private',
        floor: 2,
        ratePerNight: 500,
        capacity: 1,
        department: deptIds[2],
        status: 'Available',
      },
      {
        roomNumber: '202',
        type: 'ICU',
        floor: 2,
        ratePerNight: 1200,
        capacity: 2,
        department: deptIds[3],
        status: 'Available',
      },
      {
        roomNumber: '301',
        type: 'Emergency',
        floor: 3,
        ratePerNight: 400,
        capacity: 6,
        department: deptIds[4],
        status: 'Available',
      },
    ];
    const rooms = await Room.insertMany(roomsData);
    console.log(`Seeded 5 Rooms`);

    // Medicines
    const medsData = [
      {
        name: 'Amoxicillin',
        brand: 'Generic',
        category: 'Capsule',
        stock: 150,
        price: 15,
        expiryDate: new Date('2026-12-31'),
      },
      {
        name: 'Paracetamol',
        brand: 'Tylenol',
        category: 'Tablet',
        stock: 500,
        price: 5,
        expiryDate: new Date('2027-06-30'),
      },
      {
        name: 'Atorvastatin',
        brand: 'Lipitor',
        category: 'Tablet',
        stock: 80,
        price: 45,
        expiryDate: new Date('2025-08-15'),
      },
      {
        name: 'Lisinopril',
        brand: 'Prinivil',
        category: 'Tablet',
        stock: 120,
        price: 30,
        expiryDate: new Date('2026-03-20'),
      },
      {
        name: 'Insulin',
        brand: 'Lantus',
        category: 'Injection',
        stock: 50,
        price: 120,
        expiryDate: new Date('2025-12-01'),
      },
    ];
    const medicines = await Medicine.insertMany(medsData);
    console.log(`Seeded 5 Medicines`);

    // Lab Tests
    const testsData = [
      {
        name: 'Complete Blood Count (CBC)',
        category: 'Blood',
        price: 50,
        normalRange: 'WBC: 4-11k',
        unit: 'k/uL',
      },
      {
        name: 'Lipid Profile',
        category: 'Blood',
        price: 85,
        normalRange: 'Total Chol: <200mg/dL',
        unit: 'mg/dL',
      },
      {
        name: 'Brain MRI',
        category: 'Imaging',
        price: 550,
        normalRange: 'Normal tissue structure',
      },
      {
        name: 'Liver Function',
        category: 'Pathology',
        price: 120,
        normalRange: 'ALT: 7-55',
        unit: 'U/L',
      },
      {
        name: 'Urine Analysis',
        category: 'Urine',
        price: 40,
        normalRange: 'Negative',
      },
    ];
    const labTests = await LabTest.insertMany(testsData);
    console.log(`Seeded 5 Lab Tests`);

    console.log('\n--- Phase 2: Beds ---');
    const bedsData = [];
    rooms.forEach((r) => {
      for (let i = 1; i <= r.capacity; i++) {
        bedsData.push({
          bedNumber: i,
          room: r._id,
          status: 'Available',
        });
      }
    });
    const beds = await Bed.insertMany(bedsData);
    console.log(`Seeded ${beds.length} Beds`);

    console.log('\n--- Phase 3: Users & Patients ---');

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash('password123', salt);

    const usersData = [
      {
        _id: userIds[0],
        name: 'Admin User',
        email: 'admin@medicare.com',
        password: hashPassword,
        role: 'admin',
      },
      {
        _id: userIds[1],
        name: 'Dr. John Smith',
        email: 'john@medicare.com',
        password: hashPassword,
        role: 'doctor',
      },
      {
        _id: userIds[2],
        name: 'Dr. Sarah Wilson',
        email: 'sarah@medicare.com',
        password: hashPassword,
        role: 'doctor',
      },
      {
        _id: userIds[3],
        name: 'Dr. Robert Brown',
        email: 'robert@medicare.com',
        password: hashPassword,
        role: 'doctor',
      },
      {
        _id: userIds[4],
        name: 'Dr. Emily Davis',
        email: 'emily@medicare.com',
        password: hashPassword,
        role: 'doctor',
      },
      {
        _id: userIds[5],
        name: 'Nurse Clara',
        email: 'clara@medicare.com',
        password: hashPassword,
        role: 'nurse',
      },
      {
        _id: userIds[6],
        name: 'MedTech Mike',
        email: 'mike@medicare.com',
        password: hashPassword,
        role: 'medtech',
      },
      {
        _id: userIds[7],
        name: 'Receptionist Rachel',
        email: 'rachel@medicare.com',
        password: hashPassword,
        role: 'receptionist',
      },
      {
        _id: userIds[8],
        name: 'Pharmacist Lisa',
        email: 'lisa@medicare.com',
        password: hashPassword,
        role: 'pharmacist',
      },
      {
        _id: userIds[9],
        name: 'Accountant Kevin',
        email: 'kevin@medicare.com',
        password: hashPassword,
        role: 'accountant',
      },
    ];
    await User.insertMany(usersData);
    console.log(`Seeded 10 Users`);

    const pIds = Array.from({ length: 5 }).map(
      () => new mongoose.Types.ObjectId(),
    );
    const patientsData = [
      {
        _id: pIds[0],
        name: 'Alice Johnson',
        age: 28,
        gender: 'Female',
        phone: '555-0101',
        email: 'alice@gmail.com',
        address: '123 Oak St',
        bloodType: 'A+',
        status: 'Active',
      },
      {
        _id: pIds[1],
        name: 'Robert Parker',
        age: 45,
        gender: 'Male',
        phone: '555-0102',
        email: 'robert@gmail.com',
        address: '456 Pine St',
        bloodType: 'O+',
        status: 'Active',
      },
      {
        _id: pIds[2],
        name: 'Diana Prince',
        age: 34,
        gender: 'Female',
        phone: '555-0103',
        email: 'diana@gmail.com',
        address: '789 Maple Ave',
        bloodType: 'B-',
        status: 'Active',
      },
      {
        _id: pIds[3],
        name: 'Clark Kent',
        age: 32,
        gender: 'Male',
        phone: '555-0104',
        email: 'clark@gmail.com',
        address: '101 Farm Rd',
        bloodType: 'AB+',
        status: 'Active',
      },
      {
        _id: pIds[4],
        name: 'Bruce Wayne',
        age: 38,
        gender: 'Male',
        phone: '555-0105',
        email: 'bruce@gmail.com',
        address: '1 Gotham Way',
        bloodType: 'O-',
        status: 'Active',
      },
    ];
    await Patient.insertMany(patientsData);
    console.log(`Seeded 5 Patients`);

    console.log('\n--- Phase 4: Staff Profiles ---');

    // Doctors
    const doctorsData = [
      {
        _id: doctorIds[0],
        name: 'Dr. John Smith',
        age: 42,
        gender: 'Male',
        phone: '111-222',
        email: 'john@medicare.com',
        specialty: 'Cardiology',
        experience: 15,
        department: deptIds[0],
        userId: userIds[1],
      },
      {
        _id: doctorIds[1],
        name: 'Dr. Sarah Wilson',
        age: 39,
        gender: 'Female',
        phone: '333-444',
        email: 'sarah@medicare.com',
        specialty: 'Pediatrics',
        experience: 12,
        department: deptIds[1],
        userId: userIds[2],
      },
      {
        _id: doctorIds[2],
        name: 'Dr. Robert Brown',
        age: 50,
        gender: 'Male',
        phone: '555-666',
        email: 'robert@medicare.com',
        specialty: 'Neurology',
        experience: 20,
        department: deptIds[2],
        userId: userIds[3],
      },
      {
        _id: doctorIds[3],
        name: 'Dr. Emily Davis',
        age: 35,
        gender: 'Female',
        phone: '777-888',
        email: 'emily@medicare.com',
        specialty: 'Oncology',
        experience: 8,
        department: deptIds[3],
        userId: userIds[4],
      },
      {
        _id: doctorIds[4],
        name: 'Dr. Mark Evans',
        age: 48,
        gender: 'Male',
        phone: '999-000',
        email: 'mark@medicare.com',
        specialty: 'Orthopedics',
        experience: 18,
        department: deptIds[4],
      },
    ];
    await Doctor.insertMany(doctorsData);
    console.log(`Seeded 5 Doctors`);

    const staffData = [
      {
        name: 'Nurse Clara',
        age: 30,
        gender: 'Female',
        phone: '222-333',
        email: 'clara@medicare.com',
        role: 'Nurse',
        department: deptIds[1],
        userId: userIds[5],
        experience: 8,
        status: 'Active',
      },
      {
        name: 'MedTech Mike',
        age: 28,
        gender: 'Male',
        phone: '444-555',
        email: 'mike@medicare.com',
        role: 'Medical Technologist',
        department: deptIds[3],
        userId: userIds[6],
        experience: 5,
        status: 'Active',
      },
      {
        name: 'Rachel Reception',
        age: 35,
        gender: 'Female',
        role: 'Administrative',
        department: deptIds[0],
        experience: 10,
        userId: userIds[7],
      },
      {
        name: 'Lisa Pharma',
        age: 32,
        gender: 'Female',
        role: 'Pharmacist',
        department: deptIds[4],
        experience: 7,
        userId: userIds[8],
      },
      {
        name: 'Kevin Accountant',
        age: 40,
        gender: 'Male',
        role: 'Administrative',
        department: deptIds[4],
        experience: 12,
        userId: userIds[9],
      },
    ];
    await Staff.insertMany(staffData);
    console.log(`Seeded 5 Staff`);

    console.log('\n--- Phase 5: Transactions ---');

    // Appointments
    const appointmentsData = Array.from({ length: 15 }).map((_, i) => ({
      patient: pIds[i % 5],
      doctor: doctorIds[i % 5],
      department: deptIds[i % 5],
      datetime: new Date(
        Date.now() + i * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000,
      ),
      type: 'Consultation',
      status: i % 3 === 0 ? 'Confirmed' : i % 3 === 1 ? 'Pending' : 'Cancelled',
    }));
    await Appointment.insertMany(appointmentsData);
    console.log('Seeded 15 Appointments');

    // Admissions
    const admissionsData = [
      {
        patient: pIds[0],
        doctor: doctorIds[0],
        department: deptIds[0],
        room: rooms[0]._id,
        bed: beds[0]._id,
        admissionDate: new Date(),
        expectedDischargeDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        diagnosis: 'Acute Chest Pain',
        status: 'Admitted',
      },
      {
        patient: pIds[1],
        doctor: doctorIds[2],
        department: deptIds[2],
        room: rooms[3]._id,
        bed: beds[6]._id,
        admissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expectedDischargeDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        diagnosis: 'Neurological Observation',
        status: 'Admitted',
      },
      {
        patient: pIds[2],
        doctor: doctorIds[1],
        department: deptIds[1],
        room: rooms[1]._id,
        bed: beds[2]._id,
        admissionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        expectedDischargeDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        diagnosis: 'Pediatric Infection',
        status: 'Discharged',
        dischargeDate: new Date(),
      },
    ];
    await Admission.insertMany(admissionsData);
    await Bed.findByIdAndUpdate(beds[0]._id, {
      status: 'Occupied',
      currentPatient: pIds[0],
    });
    await Bed.findByIdAndUpdate(beds[6]._id, {
      status: 'Occupied',
      currentPatient: pIds[1],
    });
    console.log(`Seeded 3 Admissions`);

    // Lab Reports
    const labReportsData = Array.from({ length: 10 }).map((_, i) => ({
      patient: pIds[i % 5],
      doctor: doctorIds[i % 5],
      test: labTests[i % 5]._id,
      status: i % 2 === 0 ? 'Completed' : 'Processing',
      resultValue: i % 2 === 0 ? 'Normal' : '',
      findings: i % 2 === 0 ? 'Healthy results' : '',
      isBilled: false,
    }));
    await LabReport.insertMany(labReportsData);
    console.log('Seeded 10 Lab Reports');

    // Prescriptions
    const prescriptionsData = pIds.map((pId) => ({
      patient: pId,
      doctor: doctorIds[0],
      items: [
        {
          medicine: medicines[0]._id,
          dosage: '1-0-1',
          duration: '5 days',
          quantity: 10,
        },
      ],
      status: 'Dispensed',
    }));
    await Prescription.insertMany(prescriptionsData);
    console.log('Seeded 5 Prescriptions');

    // Invoices
    const invoicesData = Array.from({ length: 10 }).map((_, i) => ({
      patient: pIds[i % 5],
      doctor: doctorIds[i % 5],
      services: [
        {
          name: i % 2 === 0 ? 'Consultation' : 'Laboratory',
          amount: 50,
          quantity: 1,
        },
      ],
      totalAmount: 50,
      status: i % 2 === 0 ? 'Paid' : 'Pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }));
    await Invoice.insertMany(invoicesData);
    console.log('Seeded 10 Invoices');

    // --- Phase 6: Audit Logs ---
    const auditLogsData = [
      // Patient Creation Logs
      ...pIds.map((id, i) => ({
        entity: 'Patient',
        entityId: id,
        action: 'System Seeded',
        details: `Initial seeding for patient ${patientsData[i].name}`,
      })),
      // Admission Logs
      ...admissionsData.map((adm, i) => ({
        entity: 'Admission',
        entityId: adm.patient, // Simplified for seed
        action: i === 2 ? 'Patient Discharged' : 'Patient Admitted',
        patient: adm.patient,
        doctor: adm.doctor,
        bed: adm.bed,
        details: `Seed data: ${adm.diagnosis}`,
      })),
      // Appointment Logs
      ...appointmentsData.slice(0, 5).map((app) => ({
        entity: 'Appointment',
        entityId: app.patient,
        action: 'Appointment Created',
        patient: app.patient,
        doctor: app.doctor,
        details: 'Initial seeding of appointments',
      })),
      // Invoice Logs
      ...invoicesData.slice(0, 5).map((inv) => ({
        entity: 'Invoice',
        entityId: inv.patient,
        action: inv.status === 'Paid' ? 'Invoice Paid' : 'Invoice Generated',
        patient: inv.patient,
        doctor: inv.doctor,
        details: `Seed data total: $${inv.totalAmount}`,
      })),
    ];

    await AuditLog.insertMany(auditLogsData);
    console.log(`Seeded ${auditLogsData.length} Audit Logs`);

    console.log('\n--- Database Seeding Completed Successfully ---');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
