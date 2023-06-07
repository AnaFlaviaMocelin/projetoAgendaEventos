const { MongoClient } = require("mongodb");

// Replace the following with your Atlas connection string
const url =
  "mongodb+srv://AgendaEventos:agendaeventosapi@cluster0.ukqrzaf.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function findUserByEmail(email) {
  await client.connect();
  const db = client.db("Cluster0");
  const collection = db.collection("users");
  try {
    const user = await collection.findOne({ email: email });
    return user ? user : false;
  } catch (err) {
    console.log(err.stack);
  }
}

async function createUser(user) {
  await client.connect();
  const db = client.db("Cluster0");
  const collection = db.collection("users");
  try {
    await collection.insertOne(user);
  } catch (err) {
    console.log(err.stack);
  }
}

async function findUserById(id) {
  await client.connect();
  const db = client.db("Cluster0");
  const collection = db.collection("users");
  try {
    const user = await collection.findOne({ id: id });
    return user ? user : false;
  } catch (err) {
    console.log(err.stack);
  }
}

module.exports = { findUserByEmail, createUser };
