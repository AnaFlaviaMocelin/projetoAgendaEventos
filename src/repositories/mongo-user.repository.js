const mongoClient = require("../database/mongo.db");

class MongoUserRepository {
  async findUserByEmail(email) {
    await mongoClient.connect();
    const db = mongoClient.db("Cluster0");
    const collection = db.collection("users");
    try {
      const user = await collection.findOne({ email: email });
      return user ? user : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async createUser(user) {
    await mongoClient.connect();
    const db = mongoClient.db("Cluster0");
    const collection = db.collection("users");
    try {
      await collection.insertOne(user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async findUserById(id) {
    await mongoClient.connect();
    const db = mongoClient.db("Cluster0");
    const collection = db.collection("users");
    try {
      const user = await collection.findOne({ id: id });
      return user ? user : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

const mongoUserRepository = new MongoUserRepository();

module.exports = mongoUserRepository;
