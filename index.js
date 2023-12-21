const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Task management server is running");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
