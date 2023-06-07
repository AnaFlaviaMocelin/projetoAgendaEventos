const mongoClient = require("../database/mongo.db");

class MongoEventsRepository {
  async create(event) {
    const db = mongoClient.db("Cluster0");
    const collection = db.collection("events");
    try {
      await collection.insertOne(event);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async findMany() {
    const db = mongoClient.db("Cluster0");
    const collection = db.collection("events");
    try {
      return collection.find({}).toArray();
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

module.exports = new MongoEventsRepository();
