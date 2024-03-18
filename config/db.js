const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://zoombooz:zoombooz@cluster0.jt8ujtk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db('EduQuest')

module.exports = database
