require("dotenv").config();
const { MongoClient } = require("mongodb");
// const mongoURL = `mongodb://mongodb:${process.env.MONGODB_DOCKER_PORT}`;
const mongoURL = `mongodb://localhost:${process.env.MONGODB_DOCKER_PORT}`;
//   incase of use without docker.

const client = new MongoClient(mongoURL);

// Use create time slots result as parameter
async function insertMany(timeslots) {
  await client.connect();
  console.log("Connected successfully to server");

  const collection = client.db("availabilityDB").collection("timeslot");
  const insertResult = await collection.insertMany(timeslots);
  console.log("Inserted documents =>", insertResult);

  return "Success";
}

function insertTimeSlots(timeslots) {
  insertMany(timeslots)
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
}

// use dentistId as parameter
async function find(dentistId) {
  await client.connect();
  console.log("Connected successfully to server");

  const collection = client.db("availability").collection("timeslot");
  const findResult = await collection.find({ dentistId: dentistId }).toArray();
  console.log("Found documents =>", findResult);
  return "Success";
}

function findTimeSlotByDentistId(dentistId) {
  find(dentistId)
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
}

module.exports = { insertTimeSlots, findTimeSlotByDentistId };
