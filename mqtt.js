function runMqtt() {
  require("dotenv").config();

  const mqtt = require("mqtt");

  const brokerURI = `mqtt://host.docker.internal:${process.env.BROKER_PORT}`;
  //const brokerURI = `mqtt://broker:${process.env.BROKER_PORT}`;
  const topics = ["dentist/openinghour", "frontend/timeslot"];

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
    // message is Buffer
    console.log(message.toString());
    client.end();
  });
}

exports.runMqtt = runMqtt;
