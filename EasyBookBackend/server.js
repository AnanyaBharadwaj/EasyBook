require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "*" }));
app.use(express.json());
app.use("/auth", authRoutes)



const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected"))
  .catch((err) => {
    console.log("Mongo connection error", err);
    process.exit(1);
  });

const slotSchema = new mongoose.Schema(
  {
    courtId: { type: String, required: true },
    date: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available",
    },
    price: Number,
    bookedBy: {
      name: String,
      email: String,
      phone: String,
    },
  },
  { timestamps: true }
);

slotSchema.index({ courtId: 1, date: 1, start: 1, end: 1 }, { unique: true });
const Slot = mongoose.model("Slot", slotSchema);


/// GET API - Generate slots dynamically
app.get("/slots", async (req, res) => {
  try {
    const { courtId, date } = req.query;

    if (!courtId || !date) {
      return res.status(400).json({ message: "courtId and date are required" });
    }

    // Working hours (9 AM - 9 PM)
    const WORKING_START = 9;
    const WORKING_END = 21;

    // Generate all possible 1-hour slots
    let generatedSlots = [];
    for (let hour = WORKING_START; hour < WORKING_END; hour++) {
      const start = `${hour.toString().padStart(2, "0")}:00`;
      const end = `${(hour + 1).toString().padStart(2, "0")}:00`;
      generatedSlots.push({
        courtId,
        date,
        start,
        end,
        status: "available",
      });
    }

    // Find booked slots for this court + date
    const bookedSlots = await Slot.find({ courtId, date }).lean();

    // Keep only slots that are NOT booked
    const availableSlots = generatedSlots.filter(
      (slot) =>
        !bookedSlots.some((b) => b.start === slot.start && b.end === slot.end)
    );

    res.json(availableSlots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST API - Book a slot
const verifyToken = require("./middleware/auth");
app.post("/book", verifyToken, async (req, res) => {
  try {
    const { courtId, date, start, end, name, email, phone } = req.body;

    if (!courtId || !date || !start || !end || !name) {
      return res.status(400).json({
        message: "courtId, date, start, end, and name are required",
      });
    }

    // Check if already booked
    const existing = await Slot.findOne({ courtId, date, start, end });
    if (existing) {
      return res.status(409).json({ message: "Slot already booked" });
    }

    // Save booking
    const newBooking = await Slot.create({
      courtId,
      date,
      start,
      end,
      status: "booked",
      bookedBy: { name, email, phone },
    });

    res.json(newBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
