const { runMqtt } = require("./mqtt");
const { insertTimeSlots, findTimeSlotByDentistId } = require("./db");

//runMqtt();
const timeslots = { a: 1, a: 3, a: 4 };
insertTimeSlots(timeslots);
findTimeSlotByDentistId();

// Start mqtt
// Start mongodb
// Run create timeslots script
