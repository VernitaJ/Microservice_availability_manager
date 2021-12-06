const TimeSlotsFinder = require("time-slots-finder");
// const { insertTimeSlots, findTimeSlotByDentistId } = require("./db.js");
const dayjs = require("dayjs");
const { config } = require("dotenv");

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
  var denstistClinicTimeSlots = [];
  for (dentistClinic of data.dentists) {
    var availablePeriodsConfig = // Sets available the config needed for createDentistClinicTimeSlot()
      setAvailablePeriodsConfig(dentistClinic); 
      availablePeriodsConfig.forEach((weekDayConfig) => {  
        // Loop through each configuration to know how many timeSlots are created for each day.
    var dentistClinicTimeSlots = createDentistClinicTimeSlots(weekDayConfig); // Input one day at a time
      console.log(dentistClinicTimeSlots.length) 
        var lunchA = dentistClinicTimeSlots[dentistClinicTimeSlots/2] // get mid value
        var lunchB = dentistClinicTimeSlots[(dentistClinicTimeSlots/2)-1] // get mid value 
        var fika = dentistClinicTimeSlots[Math.floor(dentistClinicTimeSlots*0.75)]
        // get 75 percentile value
      dentistClinicTimeSlots.forEach((timeSlot) => {
        // Manipulate object to add additional info
        
        // if index = midvalue then status = "booked"
        // if index = fikavalue then status = "booked"
        var dentistStaffCount = dentistClinic.dentists;
        var counter = 0;
        (counter = (lunchA || lunchB || fika)) ? {
          timeSlot = {
            ...timeSlot,
            dentistClinicId: dentistClinic.id,
            dentistStaffId: dentistStaffCount,
            status: "unavailable",
          }
        } :
        timeSlot = {
          ...timeSlot,
          dentistClinicId: dentistClinic.id,
          dentistStaffId: dentistStaffCount,
          status: "available",
        };
        dentistStaffCount--;
        counter++;
        newDentistClinicTimeSlots.push(timeSlot);
      });
    })
  }
  // add rows to database
  //console.log(newDentistClinicTimeSlots);
}

/*
total 8hours = 16 timeslots = 1 dentist/day


{
  dentistClinicId: 1,
  dentistStaffId: 3,
  timeSlots: [{
    startAt: 2021-12-14T09:30:00.000Z,
    endAt: 2021-12-14T10:00:00.000Z,
    duration: 30,
    status: 'available'
  },
]}

 availablePeriodsConfiguration.forEach((entry)=> {
    var dentistClinicTimeSlot = createDentistClinicTimeSlots(entry);
    denstistClinicTimeSlots.push(dentistClinicTimeSlot)
      console.log(dentistClinicTimeSlot.length)
    })

    denstistClinicTimeslots
en dag i sänder.

*/

function setAvailablePeriodsConfig(dentistClinic) {
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
      availablePeriods: [availablePeriodsConfiguration],
      timeZone: "Europe/Stockholm",
    },
    from: dayjs(fromDate).toDate(),
    to: dayjs(toDate).toDate(),
  });
  return dentistClinicTimeSlots;
}
createTimeSlots();
