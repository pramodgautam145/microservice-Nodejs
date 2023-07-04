const express = require("express");
const axios = require("axios").default;
const { randomBytes } = require("crypto");

const app = express();

app.use(express.json());

app.post("/events", (req, res) => {
  console.log("Event Received by Event Bus.. Publishing..");
  const event = req.body;
  // notify the listeners (via http)
  // products service
  axios
    .post("http://localhost:4000/events", event)
    .catch(err => console.log(err));

  // reviews service
  axios
    .post("http://localhost:4001/events", event)
    .catch(err => console.log(err));

  // query service
  axios
    .post("http://localhost:4002/events", event)
    .catch(err => console.log(err));

  res.send({ status: "OK" });
});

app.listen(4005, () => {
  console.log("Event Bus Service running at port 4005 !");
});
