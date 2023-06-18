const { MongoClient } = require("mongodb");

const credentials = require("../config/credentials");

const client = new MongoClient(credentials.mongodb.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = client;
