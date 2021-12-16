const clinicTimeSlotGenerator = require("./createTimeslots.js");
const handleBookingRequest = require("./bookingRequestHandler.js");
const handleFrontendRequest = require("./frontendRequestHandler.js");

module.exports = requestEvaluator = (mqttClient) => {
  mqttClient.on("message", (topic, message) => {
    if (topic === "dentist/openinghour") {
      clinicTimeSlotGenerator(message.toString());
    } else if (topic === "dentistimo/booking/availability/req") {
      handleBookingRequest(message.toString(), mqttClient);
    } else if (topic === "frontend/timeslot/req") {
      handleFrontendRequest(message.toString(), mqttClient);
    }
  });
};
