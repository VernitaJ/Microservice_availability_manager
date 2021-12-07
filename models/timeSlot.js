var mongoose = require("mongoose");
const { Schema } = mongoose;

const timeSlotSchema = new Schema({
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  duration: { type: Number, required: true },
  clinicId: { type: Number, required: true },
  dentistStaffId: { type: Number, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model("timeSlot", timeSlotSchema);
