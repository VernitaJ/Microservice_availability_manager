const timeSlotModel = require("./models/timeSlot");

module.exports = frontendRequestHandler = async (req, mqttClient) => {
  const request = validateRequest(req);
  var response = "";
  if (request) {
    response = await getTimeSlots(request.clinicId);
  } else {
    response = JSON.stringify({
      response: "invalid request type",
    });
  }
  mqttClient.publish(
    `dentistimo/booking/availability/${request.requestId}/res`,
    response
  );
};

const getTimeSlots = async (clinicId) => {
  return await timeSlotModel
    .find({ clinicId: clinicId })
    .then((result) => {
      if (result === null) {
        return JSON.stringify({
          response: `Clinic with id:${clinicId} does not exist!`,
        });
      } else {
        return JSON.stringify({
          response: result,
        });
      }
    })
    .catch((err) => JSON.stringify({ response: "internal error" }));
};

const validateRequest = (req) => {
  try {
    const request = JSON.parse(req);
    if (!request.requestId || !request.clinicId) {
      return null;
    } else {
      return request;
    }
  } catch (err) {
    return null;
  }
};
