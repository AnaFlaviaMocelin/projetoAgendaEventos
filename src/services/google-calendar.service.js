const { google } = require("googleapis");

const googleAuthClient = require("./google-auth.service");

module.exports = {
  createEvent: async function ({
    startDate,
    endDate,
    timeZone,
    summary,
    location,
    attendees = [],
  }) {
    const event = {
      summary: summary,
      location: location,
      start: {
        dateTime: startDate,
        timeZone: timeZone,
      },
      end: {
        dateTime: endDate,
        timeZone: timeZone,
      },
      attendees,
    };
    const calendar = google.calendar({ version: "v3", auth: googleAuthClient });
    return new Promise((resolve, reject) => {
      calendar.events.insert(
        { calendarId: "primary", resource: event },
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
};
