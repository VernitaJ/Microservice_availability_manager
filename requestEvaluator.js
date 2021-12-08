const clinicTimeSlotGenerator = require("./createTimeslots.js");
const handleBookingRequest = require("./bookingRequestHandler.js");
const handleFrontendRequest = require("./frontEndRequestHandler.js");
const { MqttClient } = require("mqtt");

module.exports = requestEvaluator = (mqttClient) => {
  mqttClient.on("message", (topic, message) => {
    if (topic === "dentist/openinghour") {
      clinicTimeSlotGenerator(message.toString());
    } else if (topic === "dentistimo/booking/availability/req") {
      console.log(message.toString());
      handleBookingRequest(message.toString(), mqttClient);
    } else if (topic === "frontend/timeslot") {
      handleFrontendRequest(message.toString(), mqttClient);
    }
  });
};
