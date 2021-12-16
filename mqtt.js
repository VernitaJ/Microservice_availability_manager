require("dotenv").config();
const mqtt = require("mqtt");
const mongoose = require("mongoose");
const requestEvaluator = require("./requestEvaluator");

const brokerURI = `mqtt://host.docker.internal:${process.env.BROKER_PORT}`;
const mongoURI = `mongodb://mongodb:${process.env.MONGODB_DOCKER_PORT}`;

const mqttClient = mqtt.connect(brokerURI, {
  clientId: "availability_service",
  username: process.env.BROKER_USERNAME,
  password: process.env.BROKER_PASSWORD,
});

mqttClient.on("connect", () => {
  mqttClient.subscribe("dentist/openinghour", (err) => {
    if (err) {
      console.log("Failed to connect dentist/openinghour", err);
    }
  });
  mqttClient.subscribe("dentistimo/booking/availability/req", (err) => {
    if (err) {
      console.log("Failed to connect dentistimo/booking/availability/req", err);
    }
  });
  mqttClient.subscribe("frontend/timeslot/req", (err) => {
    if (err) {
      console.log("Failed to connect frontend/timeslot/req", err);
    }
  });
});

// Connect to MongoDB
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
      console.error(err.stack);
      process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
  }
);

requestEvaluator(mqttClient);
