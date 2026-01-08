const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.NODE_ENV === 'production'
        ? process.env.MONGO_ATLAS
        : process.env.MONGO_URI;

    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
