const TimeSlotsFinder = require("time-slots-finder");
const dayjs = require("dayjs");
const timeSlotModel = require("./models/timeSlot");

var newClinicTimeSlots = [];

module.exports = function clinicTimeSlotGenerator(message) {
  const parsedMessage = JSON.parse(message);
  const clinic = parsedMessage.openingHours;
  var periodsConfig = setPeriodsConfig(clinic);
  createTimeSlotsPerWeekDay(clinic, periodsConfig);
  insertTimeSlots(newClinicTimeSlots);
  newClinicTimeSlots = [];
};

function createTimeSlotsPerWeekDay(clinic, periodsConfig) {
  periodsConfig.forEach((weekDayConfig) => {
    var clinicTimeSlots = createClinicTimeSlots(weekDayConfig);
    addTimeSlotPerEmployee(clinic, clinicTimeSlots);
  });
}

function addTimeSlotPerEmployee(clinic, clinicTimeSlots) {
  var employeeCount = clinic.dentists;
  while (employeeCount > 0) {
    updateTimeSlotPerEmployee(employeeCount, clinic.id, clinicTimeSlots);
    employeeCount--;
  }
}

function updateTimeSlotPerEmployee(employeeCount, clinicId, clinicTimeSlots) {
  var breaks = defineBreaks(clinicTimeSlots.length);
  clinicTimeSlots.forEach((timeSlot, counter = 0) => {
    if (isBreak(counter, breaks)) {
      updatedTimeSlot = {
        ...timeSlot,
        clinicId: clinicId,
        dentistStaffId: employeeCount,
        status: "unavailable",
      };
    } else {
      updatedTimeSlot = {
        ...timeSlot,
        clinicId: clinicId,
        dentistStaffId: employeeCount,
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
  var breaks = [];
  var lunchA = breaks.push(Math.round(input.length / 2)); // get mid value
  breaks.push(lunchA - 1); // get mid value
  breaks.push(Math.round(input.length * 0.75));
  return breaks;
}

function setPeriodsConfig(clinic) {
  var periodsConfiguration = [];
  for (const [key, value] of Object.entries(clinic.openingHours)) {
    var day = key;
    var isoWeekDay = translateWeekDayStringToISOWeekDay(day);
    var startTime = addLeadingZero(value.split("-")[0]);
    var endTime = value.split("-")[1];
    var shifts = [{ startTime, endTime }];
    periodsConfiguration.push({
      isoWeekDay,
      shifts: shifts,
    });
  }
  return periodsConfiguration;
}

function createClinicTimeSlots(periodsConfiguration) {
  var toDate = dayjs()
    .add(14, "days")
    .utcOffset(2, true)
    .startOf("date")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  var fromDate = dayjs()
    .utcOffset(2, true)
    .startOf("date")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  var clinicTimeSlots = [];
  var clinicTimeSlots = TimeSlotsFinder.getAvailableTimeSlotsInCalendar({
    configuration: {
      timeSlotDuration: 30,
      availablePeriods: [periodsConfiguration],
      slotStartMinuteStep: 1,
      timeZone: "Europe/Stockholm",
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
