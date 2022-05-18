const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.idrpk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("taskTaker").collection("tasks");

    // get all tasks api
    app.get("/tasks", async (req, res) => {
      const query = {};
      const cursor = taskCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // post single task api
    app.post("/task", async (req, res) => {
      const data = req.body;
      const result = await taskCollection.insertOne(data);
      res.send(result);
    });

    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: { role: "complete" },
      };
      const result = await taskCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete a task api
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(filter);
      res.send(result);
    });
    console.log("connected to db");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
