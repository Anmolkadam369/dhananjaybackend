const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const app = express();
const route = require('./route/routes');
const port = process.env.PORT || 3001;
mongoose.set("strictQuery", true);

require('dotenv').config();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`Received request on ${req.path} with method ${req.method}`);
  console.log("Request Body:", req.body);  // Logs all text fields
  console.log("Files:", req.files); 
  next();
});


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
mongoose
  .connect(
    `${process.env.DBLINK}`, { useNewUrlParser: true }
  )
  .then(() => {
    console.log("mongoDB is connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use('/', route);

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});