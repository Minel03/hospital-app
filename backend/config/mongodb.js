import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  mongoose.connection.on('connected', () => {
    console.log('DB Connected');
  });

  await mongoose.connect(`${process.env.MONGODB_URI}/hospital`);
};

export default connectDB;
