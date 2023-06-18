const { getEnv } = require("./get-env");

module.exports = {
  google: {
    clientId: getEnv("GOOGLE_CLIENT_ID"),
    clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
  },
  mongodb: {
    url: getEnv("MONGO_DB_URL"),
  },
};
