const mongoose = require("mongoose");

const userRegSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    eventID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["registered", "cancelled"],
      default: "registered",
    },
  },
  {
    timestamps: true,
  },
);

userRegSchema.index({ email: 1, eventID: 1 }, { unique: true });

moduleexports = mongoose.model("UserRegister", userRegSchema);
