const express = require("express");
const router = express.Router();

const Event = require("../models/event.model");

// create a new event
router.post("/", async (req, res) => {
  try {
    const { name, total_seats, event_date } = req.body;
    const event = new Event({ name, total_seats, event_date });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Event name already exists",
      });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all events , sorted by date

router.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.upcoming === "true") {
      filter.event_date = { $gte: new Date() };
    }

    const events = await Event.find(filter).sort({ event_date: 1 });
    const formattedEvents = events.map((events) => ({
      _id: events._id,
      name: events.name,
      total_seats: events.total_seats,
      registered_count: events.registered_count,
      event_date: events.event_date,
      available_seats: events.total_seats - events.registered_count,
    }));

    res.json(formattedEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// get event by id

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// router.delete("/:id", async (req, res) => {
//   try {
//     const data = await Event.findByIdAndDelete(req.params.id);
//     if (!data) {
//       return res.status(404).json({ error: "Event not found" });
//     }
//     res.json({ message: "Event deleted successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

module.exports = router;
