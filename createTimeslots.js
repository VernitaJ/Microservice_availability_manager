const TimeSlotsFinder = require("time-slots-finder");
// const { insertTimeSlots, findTimeSlotByDentistId } = require("./db.js");
const dayjs = require("dayjs");

const data = {
  dentists: [
    {
      id: 1,
      dentists: 3,
      openinghours: {
        monday: "9:00-17:00",
        tuesday: "8:00-17:00",
        wednesday: "7:00-16:00",
        thursday: "9:00-17:00",
        friday: "9:00-15:00",
      },
    },
    {
      id: 2,
      dentists: 1,
      openinghours: {
        monday: "7:00-19:00",
        tuesday: "7:00-19:00",
        wednesday: "7:00-19:00",
        thursday: "7:00-19:00",
        friday: "7:00-19:00",
      },
    },
    {
      id: 3,
      dentists: 2,
      openinghours: {
        monday: "6:00-15:00",
        tuesday: "8:00-17:00",
        wednesday: "7:00-12:00",
        thursday: "7:00-17:00",
        friday: "8:00-16:00",
      },
    },
    {
      id: 4,
      dentists: 3,
      openinghours: {
        monday: "10:00-18:00",
        tuesday: "10:00-18:00",
        wednesday: "10:00-18:00",
        thursday: "10:00-18:00",
        friday: "10:00-18:00",
      },
    },
  ],
};

var toDate = dayjs()
  .add(14, "days")
  .utcOffset(2, true)
  .startOf("date")
  .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
var today = new Date();
var fromDate = dayjs()
  .utcOffset(2, true)
  .startOf("date")
  .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

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

function createTimeSlots() {
  var newDentistClinicTimeSlots = [];
  for (dentistClinic of data.dentists) {
    var availablePeriodsConfiguration =
      setAvailablePeriodsConfiguration(dentistClinic);
    dentistClinicTimeSlots = createDentistClinicTimeSlots(
      availablePeriodsConfiguration
    );
    dentistClinicTimeSlots.forEach((timeSlot) => {
      var dentistStaffCount = dentistClinic.dentists;
      timeSlot = {
        ...timeSlot,
        dentistClinicId: dentistClinic.id,
        dentistStaffId: dentistStaffCount,
        status: "available",
      };
      dentistStaffCount--;
      newDentistClinicTimeSlots.push(timeSlot);
    });
  }
  // add rows to database
}

createTimeSlots();

function setAvailablePeriodsConfiguration(dentistClinic) {
  var availablePeriodsConfiguration = [];
  for (const [key, value] of Object.entries(dentistClinic.openinghours)) {
    var day = key;
    var isoWeekDay = translateWeekDayStringToISOWeekDay(day);
    var startTime = addLeadingZero(value.split("-")[0]);
    var endTime = value.split("-")[1];
    var shifts = [{ startTime, endTime }];
    availablePeriodsConfiguration.push({
      isoWeekDay,
      shifts: shifts,
    });
  }
  return availablePeriodsConfiguration;
}

function createDentistClinicTimeSlots(availablePeriodsConfiguration) {
  var dentistClinicTimeSlots = [];
  var dentistClinicTimeSlots = TimeSlotsFinder.getAvailableTimeSlotsInCalendar({
    configuration: {
      timeSlotDuration: 30,
      availablePeriods: [...availablePeriodsConfiguration],
      timeZone: "Europe/Stockholm",
    },
    from: dayjs(fromDate).toDate(),
    to: dayjs(toDate).toDate(),
  });
  return dentistClinicTimeSlots;
}
