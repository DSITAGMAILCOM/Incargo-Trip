const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./Routes/authRoutes');
const packingRoutes = require('./Routes/packingRoutes');
const tripRoutes = require('./Routes/tripRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Trip APIs server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/packing', packingRoutes);
app.use('/api/trips', tripRoutes);

const startServer = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected');
    } else {
      console.log('MONGO_URI not set. Skipping database connection.');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
