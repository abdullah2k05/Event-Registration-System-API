const express = require("express");
const router = express.Router();
const RegModel = require("../models/user-register.model");
const EventModel = require("../models/event.model");

// Create a new registration
router.post("/", async (req, res) => {
  try {
    const { name, email, eventID } = req.body;

    // edge case 1 : Event Existed or not
    const findData = await EventModel.findById(eventID);
    if (!findData) {
      return res.status(404).json({ error: "Event not found" });
    }

    // no 2 : duplicate registration
    const existReg = await RegModel.findOne({
      email,
      eventID,
      status: "registered",
    });
    if (existReg) {
      return res
        .status(400)
        .json({ error: "User already registered for this event" });
    }

    const updatedEvent = await EventModel.findOneAndUpdate(
      {
        _id: eventID,
        registered_count: { $lt: findData.total_seats },
      },
      {
        $inc: { registered_count: 1 },
      },
      { new: true },
    );

    if (!updatedEvent) {
      return res.status(400).json({
        error: "Event is full",
      });
    }

    const registration = await RegModel.create({
      name,
      email,
      eventID,
    });

    res.status(201).json(registration);
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "User already registered for this event" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// // Delete a registration
// router.delete("/:id", async (req, res) => {
//   try {
//     const registration = await Event.findByIdAndDelete(req.params.id);
//     if (!registration) {
//       return res.status(404).json({ error: "Registration not found" });
//     }
//     if (registration.status === "cancelled") {
//       return res.status(400).json({ error: "Registration already cancelled" });
//     }
//     EventModel.registered_count -= 1;
//     await EventModel.save();
//     res.status(200).json({ message: "Registration cancelled successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// Get all registrations
router.get("/", async (req, res) => {
  try {
    const data = await RegModel.find().populate("eventID");

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Cancel a registration
router.post("/:id/cancel", async (req, res) => {
  try {
    const dataReg = await RegModel.findById(req.params.id);
    if (!dataReg) {
      return res.status(404).json({ error: "Registration not found" });
    }
    if (dataReg.status === "cancelled") {
      return res.status(400).json({ error: "Registration already cancelled" });
    }

    dataReg.status = "cancelled";
    await dataReg.save();

    await EventModel.findByIdAndUpdate(dataReg.eventID, {
      $inc: { registered_count: -1 },
    });

    res.status(200).json("Cancelled successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
