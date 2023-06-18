const { ObjectId } = require("mongodb");
const mongoClient = require("../database/mongo.db");

const clusterName = "Cluster0";
const collectionName = "events";

const db = mongoClient.db(clusterName);
const collection = db.collection(collectionName);

class MongoEventsRepository {
  async create(event) {
    try {
      await collection.insertOne(event);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async findMany() {
    try {
      return collection.find({}).toArray();
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async findOneById(id) {
    try {
      const result = await collection.findOne({
        _id: new ObjectId(id),
      });
      console.log(result, id, "result");
      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async deleteById(id) {
    try {
      const result = await collection.findOneAndDelete({
        _id: new ObjectId(id),
      });
      console.log(result, "result to delete");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

module.exports = new MongoEventsRepository();
