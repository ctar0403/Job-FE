const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  const uri = config.MONGO_URI || "mongodb://127.0.0.1:27017/kers?gssapiServiceName=mongodb";
  try {
    const db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to MongoDB!');

    return db;
  } catch (err) {
    console.error('MongoDB connection failed:', err.message || err);
    // Do not exit the process in development; allow the server to run without DB for local dev
    return null;
  }
};

module.exports = connectDB;
