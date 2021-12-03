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

// const { MongoClient } = require('mongodb');

// // Create .env config

// var port = 3002 || 3002; // Will we need to keep track if services collide etc?

// const url =  "mongodb://localhost:27017";
// const client = new MongoClient(url);

// // Database Name
// const dbName = 'myProject';

// async function main() {
//     // Use connect method to connect to the server
//     await client.connect();
//     console.log('Connected successfully to server');
//     const db = client.db(dbName);
//     const collection = db.collection('documents');

//     // the following code examples can be pasted here...

//     return 'done.';
//   }

// main()
// .then(console.log)
// .catch(console.error)
// .finally(() => client.close());
