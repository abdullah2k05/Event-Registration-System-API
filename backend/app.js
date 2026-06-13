const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const eventRoutes = require("./routes/event.routes");
const registrationRoutes = require("./routes/registration.routes");

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/register", registrationRoutes);

module.exports = app;
