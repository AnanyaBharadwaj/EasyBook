require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI;
const slotSchema = new mongoose.Schema({
  courtId: String,
  date: String,
  start: String,
  end: String,
  status: String,
  price: Number,
  bookedBy: Object,
});
slotSchema.index({ courtId: 1, date: 1, start: 1, end: 1 }, { unique: true });
const Slot = mongoose.model("Slot", slotSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB for seeding");

  //Data to test
  const date = new Date().toISOString().slice(0, 10);
  await Slot.deleteMany({});
  const base = [
    { courtId: "Court-1", date, start: "07:00", end: "08:00", price: 300 },
    { courtId: "Court-1", date, start: "08:00", end: "09:00", price: 300 },
    { courtId: "Court-2", date, start: "07:00", end: "08:00", price: 350 },
  ];
  await Slot.insertMany(base);
  console.log("Seeded", base.length, "slots for date", date);
//   const all = await Slot.find({});
//   console.log("All slots in DB:", all);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
