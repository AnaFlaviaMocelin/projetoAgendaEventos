const mongoClient = require("../database/mongo.db");

class MongoUserRepository {
  async findUserByEmail(email) {
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

  async updateUser({ _id: id, ...data }) {
    const db = mongoClient.db("Cluster0");
    const collection = db.collection("users");
    try {
      await collection.replaceOne({ _id: id }, data);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async findUserById(id) {
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
