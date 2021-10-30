require('dotenv').config();
const { json } = require('express');
const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use('/', (req, res) =>
  res.status(200).json({
    message: 'test',
  })
);

module.exports = app;
