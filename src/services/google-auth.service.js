const { google } = require("googleapis");

const credentials = require("../config/credentials");

const oauth2Client = new google.auth.OAuth2(
  credentials.google.clientId,
  credentials.google.clientSecret,
  credentials.google.redirectUrl
);

module.exports = oauth2Client;
