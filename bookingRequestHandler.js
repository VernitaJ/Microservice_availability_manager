const timeSlotModel = require("./models/timeSlot");

module.exports = bookingRequestHandler = async (req, mqttClient) => {
  const request = validateRequest(req);
  if (request) {
    var response = "";
    if (!request.requestId) {
      response = JSON.stringify({ status: 400, response: "bad request" });
    } else {
      response = await getTimeSlot(request);
    }
  } else {
    response = JSON.stringify({
      status: 400,
      response: "bad request",
    });
  }
  mqttClient.publish(`frontend/timeslot/${message.requestId}/res`, response);
};

const getTimeSlot = async (request) => {
  return await timeSlotModel
    .findOneAndUpdate(
      {
        clinicId: request.clinicId,
        startAt: request.startAt,
        status: "available",
      },
      { status: "unavailable" }
    )
    .then((result) => {
      if (result === null) {
        return JSON.stringify({
          response: "deny",
        });
      } else {
        return JSON.stringify({
          response: "approve",
        });
      }
    })
    .catch((err) => JSON.stringify({ response: "internal error" }));
};

const validateRequest = (req) => {
  try {
    const request = JSON.parse(req);
    if (!request.requestId || !request.clinicId || !request.startAt) {
      return null;
    } else {
      return request;
    }
  } catch (err) {
    return null;
  }
};
