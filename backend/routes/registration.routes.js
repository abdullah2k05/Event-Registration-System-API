const express = require("express");
const router = express.Router();
const Event = require("../models/user-register.model");

router.post("/", async (req, res) => {
  try {
    const { name, email, eventID } = req.body;
    const registration = new Event({ name, email, eventID });
    await registration.save();
    res.status(201).json(registration);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const registration = await Event.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Event.find().populate("eventID");
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
