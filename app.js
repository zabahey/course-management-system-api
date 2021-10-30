require('dotenv').config();
const { json } = require('express');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/user');

mongoose.connect(process.env.MONGO_ATLAS_URL);

app.use(
  cors({
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
