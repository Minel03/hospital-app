import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import patientRouter from './routes/patientRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import appointmentRouter from './routes/appointmentRoute.js';
import departmentRouter from './routes/departmentRoute.js';
import staffRouter from './routes/staffRoute.js';
import admissionRouter from './routes/admissionRoute.js';
import bedRouter from './routes/bedRoute.js';
import roomRouter from './routes/roomRoute.js';
import invoiceRouter from './routes/invoiceRoute.js';
import auditLogRouter from './routes/auditLogRoute.js';
import analyticsRouter from './routes/analyticsRoute.js';
import settingsRouter from './routes/settingsRoute.js';
import userRouter from './routes/userRoute.js';
import pharmacyRouter from './routes/pharmacyRoute.js';
import labRouter from './routes/labRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

//Middleware
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/patient', patientRouter);
app.use('/api/appointment', appointmentRouter);
app.use('/api/admission', admissionRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/staff', staffRouter);
app.use('/api/department', departmentRouter);
app.use('/api/bed', bedRouter);
app.use('/api/room', roomRouter);
app.use('/api/invoice', invoiceRouter);
app.use('/api/logs', auditLogRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/user', userRouter);
app.use('/api/pharmacy', pharmacyRouter);
app.use('/api/lab', labRouter);

app.get('/', (req, res) => {
  res.send('API Working');
});

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
