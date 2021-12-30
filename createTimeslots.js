const dayjs = require("dayjs");
const timeSlotModel = require("./models/timeSlot");

module.exports = function clinicTimeSlotGenerator(message) {
  const data = JSON.parse(message);
  const clinic = data.openingHours;
  const duration = setDateDuration(0, 60);
  var timeSlots = generateTimeSlots(clinic, duration);
  insertTimeSlots(timeSlots);
  var timeSlots = [];
};

function generateTimeSlots(clinic, duration) {
  var timeSlots = [];
  const timeSlotDuration = 30;
  for (var dentistId = 1; dentistId <= clinic.dentists; dentistId++) {
    while (dayjs(duration.startDate).isBefore(duration.endDate)) {
      if (
        dayjs(duration.startDate).day() == 0 ||
        dayjs(duration.startDate).day() == 6
      ) {
        duration.startDate = dayjs(duration.startDate).add(1, "day");
      } else {
        var dayTimeSlots = [];
        var day = dayjs(duration.startDate).format("dddd").toLowerCase();
        var startTime = addLeadingZero(
          clinic.openingHours[day].split("-")[0]
        ).slice(0, 2);
        var endTime = clinic.openingHours[day].split("-")[1].slice(0, 2);
        var openTime = dayjs(duration.startDate)
          .hour(startTime)
          .format(`YYYY-MM-DDTHH:mm:ss.SSSZ`);
        var closeTime = dayjs(duration.startDate)
          .hour(endTime)
          .format(`YYYY-MM-DDTHH:mm:ss.SSSZ`);

        var totalTimeSlots = endTime - startTime;
        var breaks = [];
        breaks.push(scheduleFika(totalTimeSlots, openTime));
        if (totalTimeSlots > 5) {
          breaks.push(...scheduleLunch(totalTimeSlots, openTime));
        }

        while (dayjs(openTime).isBefore(closeTime)) {
          var timeSlot = {
            startAt: dayjs(openTime).format(`YYYY-MM-DDTHH:mm:ss.SSSZ`),
            endAt: dayjs(openTime)
              .add(timeSlotDuration, "minutes")
              .format(`YYYY-MM-DDTHH:mm:ss.SSSZ`),
            duration: timeSlotDuration,
            clinicId: clinic.id,
            dentistStaffId: dentistId,
            status: isBreak(openTime, breaks) ? "unavailable" : "available",
          };
          dayTimeSlots.push(timeSlot);
          openTime = dayjs(openTime).add(timeSlotDuration, "minutes");
        }
        timeSlots.push(...dayTimeSlots);
        dayTimeSlots = [];
        duration.startDate = dayjs(duration.startDate).add(1, "days");
      }
    }
    return timeSlots;
  }
}

function setDateDuration(daysStart, daysEnd) {
  var startDate = dayjs()
    .add(daysStart ? daysStart : 0, "days")
    .startOf("date")
    .format(`YYYY-MM-DDTHH:mm:ss.SSSZ`);
  var endDate = dayjs()
    .add(daysEnd, "days")
    .endOf("date")
    .format(`YYYY-MM-DDTHH:mm:ss.SSSZ`);
  return { startDate: startDate, endDate: endDate };
}

function scheduleFika(totalTimeSlots, openTime) {
  var breakSlot = dayjs(openTime).add((totalTimeSlots * 60) / 4, "minutes");
  return breakSlot;
}

function scheduleLunch(totalTimeSlots, openTime) {
  var lunch = [];
  var breakSlot = dayjs(openTime).add((totalTimeSlots * 60) / 2, "minutes");
  lunch.push(breakSlot);
  breakSlot = dayjs(openTime).add((totalTimeSlots * 60) / 2 + 30, "minutes");
  lunch.push(breakSlot);
  return lunch;
}

function isBreak(openTime, breaks) {
  return breaks.find((breakSlot) => dayjs(openTime).isSame(breakSlot));
}

function insertTimeSlots(timeSlots) {
  timeSlotModel.insertMany(timeSlots, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully inserted time slots");
    }
  });
}

function addLeadingZero(time) {
  if (time.length == 4) {
    time = "0" + time;
  }
  return time;
}
