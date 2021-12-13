# Availability Manager

A micro service to create, store and manage available time-slots using NodeJS, MongoDB and Mqtt.

## Getting Started

- Create .env file by following the template on .env.sample
- `docker-compose up`

## Request from Frontend Template

#### MQTT Request Topic -> _"frontend/dentist/req"_

```JSON
{
"requestId":"uniqueId",
"clinicId": "1",
}
```

#### MQTT Response Topic -> _"frontend/timeslot/{requestId}/res"_

```JSON
response: {
    [
        {
        startAt: "2022-01-01T10:00:00.000Z",
        endAt: "2022-01-01T10:30:00.000Z",
        duration: "30",
        clinicId: "1",
        dentistStaffId: "1",
        status: "available",
        },
        {
        startAt: "2022-01-01T10:00:00.000Z",
        endAt: "2022-01-01T10:30:00.000Z",
        duration: "30",
        clinicId: "1",
        dentistStaffId: "2",
        status: "unavailable",
        },
        {
        startAt: "2022-01-01T10:30:00.000Z",
        endAt: "2022-01-01T11:00:00.000Z",
        duration: "30",
        clinicId: "1",
        dentistStaffId: "1",
        status: "available",
        },
        ... and 300 more objects
    ]
}
```

## Request from Booking Template

#### MQTT Request Topic -> _"dentistimo/booking/availability/req"_

```JSON
{
"requestId":"uniqueId",
"clinicId": "1",
"startAt": "2022-01-01T10:00:00.000Z"
}
```

#### MQTT Response Topic -> _"dentistimo/booking/availability/{requestId}/res"_

```JSON
{
"response": "approve"
}
```

```JSON
{
"response": "deny"
}
```
