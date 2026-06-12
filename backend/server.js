const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = require("./app");

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
