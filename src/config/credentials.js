const crypto = require("crypto");
const { getEnv } = require("./get-env");

module.exports = {
  google: {
    clientId: getEnv("GOOGLE_CLIENT_ID"),
    clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
    redirectUrl: getEnv(
      "GOOGLE_AUTH_REDIRECT_CALLBACK_URL",
      false,
      "http://localhost:3000/auth/google/callback"
    ),
  },
  mongodb: {
    url: getEnv("MONGO_DB_URL"),
  },
  session: {
    secret: getEnv("SESSION_SECRET_KEY", false, crypto.randomUUID()),
  },
  email: {
    host: getEnv("EMAIL_SMTP_HOST"),
    port: getEnv("EMAIL_SMTP_PORT"),
    user: getEnv("EMAIL_SMTP_USER"),
    password: getEnv("EMAIL_SMTP_PASSWORD"),
  },
};
