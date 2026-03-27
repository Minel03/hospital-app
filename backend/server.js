import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import patientRouter from './routes/patientRoute.js';
import doctorRouter from './routes/doctorRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

//Middleware
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/patient', patientRouter);
app.use('/api/doctor', doctorRouter);

app.get('/', (req, res) => {
  res.send('API Working');
});

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
