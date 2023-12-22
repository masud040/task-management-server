const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hchwfds.mongodb.net/?retryWrites=true&w=majority`;
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(
  cors({
    origin: ["https://task-management-27cd9.web.app", "http://localhost:5173"],
    credentials: true,
  })
);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // await client.connect();
    const taskCollections = client.db("Task-Management").collection("tasks");
    const userBaseCollections = client
      .db("Task-Management")
      .collection("userBase");

    // get tasks
    app.get("/tasks/:email", async (req, res) => {
      const query = {
        email: req.params?.email,
      };
      const result = await taskCollections.find(query).toArray();
      res.send(result);
    });

    // get user base
    app.get("/userBase", async (req, res) => {
      const result = await userBaseCollections.find().toArray();
      res.send(result);
    });

    // update status
    app.patch("/tasks/:id", async (req, res) => {
      const task = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: { status: task.status },
      };
      const result = await taskCollections.updateOne(query, updateDoc, options);
      res.send(result);
    });
    app.patch("/task/:id", async (req, res) => {
      const task = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: task?.title,
          descriptions: task?.descriptions,
          deadlines: task?.deadlines,
          priority: task?.priority,
        },
      };
      const result = await taskCollections.updateOne(query, updateDoc, options);
      res.send(result);
    });
    // add tasks
    app.post("/tasks", async (req, res) => {
      const tasks = req.body;
      const result = await taskCollections.insertOne(tasks);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Task management server is running");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
