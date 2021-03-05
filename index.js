const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const helmet = require("helmet");

// ---------------- Express server initialization -------------------
app.use(express.json({limit: '5mb', verify: (req, res, buf) => {req.rawBody = buf }}));
app.use(express.urlencoded({ extended: true, limit: '5mb' , parameterLimit: 100}));
app.use(helmet());

// ---------------- CORS -------------------
app.use(cors({
  origin: true,
  credentials: true,
}));
app.options('*', cors()) // include before other routes

// ---------------- Express view engine -------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

// ---------------- Mongo+Mongoose -------------------
mongoose.connect('mongodb://localhost/attain',{ 
  useUnifiedTopology: true, 
  useNewUrlParser: true, 
  useCreateIndex: true,
  useFindAndModify: false
}).then(() =>  console.log('Successful connection to MongoDB')).catch((err) => console.error("DB Error:  "+  JSON.stringify(err)));
// mongoose.set('debug', true)

// ---------------- Morgan initialization -------------------
app.use(morgan(':method :url | :status | :response-time ms'));

//Router
app.use(require('./routes'))

app.use(function(req, res, next) {
  res.status(404).json({code:404, error: 'Are you lost my child?'})
});

app.listen(process.env.PORT ? process.env.PORT : 3099, () => {
  console.log(`Server is listening on port: ${process.env.PORT} in dev environment`);
});

module.exports = app;