const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    total_seats: {
      type: Number,
      required: true,
      min: 1,
    },
    event_data: {
      type: Date,
      required: true,
      null: false,
      greaterthan: Date().now(),
    },
  },
  {
    timestamps: true,
  },
);
