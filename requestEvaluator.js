const clinicTimeSlotGenerator = require("./createTimeslots.js");

module.exports = requestEvaluator = (mqttClient) => {
  mqttClient.on("message", (topic, message) => {
    if (topic === "dentist/openinghour") {
      clinicTimeSlotGenerator(message.toString());
    } else if (topic === "dentistimo/booking/availability/req") {
      console.log(message.toString());
    }
  });
};
