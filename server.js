require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(logger);
app.use(express.json());

const urlRoutes = require('./routes/urlRoutes');
app.use('/api/url', urlRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err.message);
  process.exit(1);
});
