require("dotenv").config();
const { MongoClient } = require("mongodb");
const mongoURL = `mongodb://mongodb:${process.env.MONGODB_DOCKER_PORT}`;
// const mongoURL = `mongodb://localhost:${process.env.MONGODB_DOCKER_PORT}`;
//   incase of use without docker.

const client = new MongoClient(mongoURL);
const dbName = "availabilityDB";

// Use create time slots result as parameter
async function insertMany(timeslots) {
  await client.connect();
  console.log("Connected successfully to server");

  const collection = client.db(dbName).collection("timeslot");
  await collection.insertMany(timeslots);
}

function insertTimeSlots(timeslots) {
  insertMany(timeslots)
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
}

async function find(clinicId) {
  await client.connect();
  console.log("Connected successfully to server");

  const collection = client.db(dbName).collection("timeslot");
  const findResult = await collection.find({ clinicId: clinicId }).toArray();
  console.log("Found documents =>", findResult);
  return findResult;
}

function findTimeSlotByClinicId(dentistId) {
  return find(dentistId)
    .catch(console.error)
    .finally(() => client.close());
}

module.exports = { insertTimeSlots, findTimeSlotByClinicId };
