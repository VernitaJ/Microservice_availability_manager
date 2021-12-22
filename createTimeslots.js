const TimeSlotsFinder = require("time-slots-finder");
const dayjs = require("dayjs");
const timeSlotModel = require("./models/timeSlot");

var newClinicTimeSlots = [];

module.exports = function clinicTimeSlotGenerator(message) {
  const parsedMessage = JSON.parse(message);
  const clinic = parsedMessage.openingHours;
  if(clinic.id === 2){
  createTimeSlotsPerWeekDay(clinic);
  insertTimeSlots(newClinicTimeSlots);
  newClinicTimeSlots = [];
}
};

function createTimeSlotsPerWeekDay(clinic) {
  const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  weekDays.forEach((weekDay) => {
    var config = setPeriodConfig(clinic.openingHours[weekDay], weekDay);
    var clinicTimeSlots = createClinicTimeSlots(config);
    updateTimeSlot(clinic.id, clinicTimeSlots)
    if(clinic.id === 2)
      console.log(clinicTimeSlots)
  });
}

function addTimeSlotPerEmployee(clinic, clinicTimeSlots) {
  var employeeCount = clinic.dentists;
  while (employeeCount > 0) {
    updateTimeSlotPerEmployee(employeeCount, clinic.id, clinicTimeSlots);
    employeeCount--;
  }
}

function updateTimeSlot(clinicId, clinicTimeSlots) {
  console.log("update time slots: ", clinicTimeSlots.length)
  var breaks = defineBreaks(clinicTimeSlots);
  clinicTimeSlots.forEach((timeSlot, counter = 0) => {
    var updatedTimeSlot = {};
    if (isBreak(counter, breaks)) {
      updatedTimeSlot = {
        ...timeSlot,
        clinicId: clinicId,
        dentistStaffId: 1,
        status: "unavailable",
      };
    } else {
      updatedTimeSlot = {
        ...timeSlot,
        clinicId: clinicId,
        dentistStaffId: 1,
        status: "available",
      };
    }
    counter++;
    newClinicTimeSlots.push(updatedTimeSlot);
  });
}

function isBreak(counter, breaks) {
  if (counter == breaks[0] || counter == breaks[1] || counter == breaks[3]) {
    return true;
  } else {
    return false;
  }
}

function defineBreaks(input) {
  console.log("input: ", input)
  var breaks = [];
  var lunchA = Math.round(input / 2); 
  var lunchB = lunchA -1; 
  var fikaBreak = Math.round(input * 0.75); 
  breaks.push(lunchA);
  breaks.push(lunchB);
  breaks.push(fikaBreak);
  console.log("breaks"+breaks)
  return breaks;
}

function setPeriodConfig(openingHours, weekDay) {
    var isoWeekDay = translateWeekDayStringToISOWeekDay(weekDay);
    var startTime = addLeadingZero(openingHours.split("-")[0]);
    var endTime = openingHours.split("-")[1];
    var shifts = [{ startTime, endTime }];
    return {
      isoWeekDay,
      shifts: shifts,
    }
}

function createClinicTimeSlots(periodsConfiguration) {
  var toDate = dayjs()
    .add(1, "days")
 //   .utcOffset(2, true)
    .startOf("date")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  var fromDate = dayjs()
 //   .utcOffset(2, true)
    .startOf("date")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  var clinicTimeSlots = [];
  var clinicTimeSlots = TimeSlotsFinder.getAvailableTimeSlotsInCalendar({
    configuration: {
      timeSlotDuration: 30,
      availablePeriods: [periodsConfiguration],
      slotStartMinuteStep: 1,
      //timeZone: "Europe/Stockholm",
      timeZone: "Africa/Abidjan",
    },
    from: dayjs(fromDate).toDate(),
    to: dayjs(toDate).toDate(),
  });
  return clinicTimeSlots;
}

const insertTimeSlots = (timeSlots) => {
  timeSlotModel.insertMany(timeSlots, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      console.log(docs);
    }
  });
};

function translateWeekDayStringToISOWeekDay(weekDayString) {
  switch (weekDayString) {
    case "monday":
      return 1;
    case "tuesday":
      return 2;
    case "wednesday":
      return 3;
    case "thursday":
      return 4;
    case "friday":
      return 5;
    case "saturday":
      return 6;
    case "sunday":
      return 7;
    default:
      return 0;
  }
}

function addLeadingZero(time) {
  if (time.length == 4) {
    time = "0" + time;
  }
  return time;
}
