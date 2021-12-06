function runMqtt() {
  require("dotenv").config();
  const mqtt = require("mqtt");
  const { clinicTimeSlotGenerator } = require("./createTimeslots");

  const brokerURI = `mqtt://host.docker.internal:${process.env.BROKER_PORT}`;
  //const brokerURI = `mqtt://broker:${process.env.BROKER_PORT}`;
  const topics = ["dentist/openinghour", "dentistimo/booking/availability/req"];

  const client = mqtt.connect(brokerURI, {
    clientId: "availability_checker",
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD,
  });

  client.on("connect", () => {
    client.subscribe(topics, (err) => {
      if (!err) {
        console.log(`Successfully connected to ${topics}`);
      } else {
        console.log(err);
      }
    });
  });

  client.on("message", (topic, message) => {
    console.log(topic);
    console.log(message);
    if (topic === topics[0]) {
      console.log("Time to import the data!");
      console.log(message.toString());
      clinicTimeSlotGenerator(message.toString());
      // Handle response with import data
    } else if (topic === topics[1]) {
      // var responseData = findTimeSlotByClinicId(1);
      // console.log(responseData);
      // handle request to answer with data
      // handleFrontendRequest(message.toString(), mqttClient)
    }
    console.log(message.toString());
    client.end();
  });
}

exports.runMqtt = runMqtt;
