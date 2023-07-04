const express = require("express");
const axios = require("axios").default;
const { randomBytes } = require("crypto");
const amqp = require("amqplib");
const Review = require("./models/review.model");
const mongoose = require("mongoose");
const isAuthenticated = require("pubauthmiddleware");

var channel, connection;

const app = express();
mongoose.connect(
  "mongodb://mongo-service/reviewsdb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`Product-Service DB Connected`);
  },
);

app.use(express.json());
// Connect to RabbitMQ
async function connectToRabbitMQ() {
  const amqpServer = "amqp://rabbitmq-service";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("review-created-queue");
}
connectToRabbitMQ();

// get all reviews
app.get("/products/:id/reviews", isAuthenticated, async (req, res) => {
  let products = await Review.find({});
  res.send(products);
});

// add new review
app.post("/products/:id/reviews", isAuthenticated, async (req, res) => {
  try {
    const id = randomBytes(4).toString("hex");
    const { content } = req.body;
    const productId = req.params.id;
    // add review to db
    const newReview = new Review({ id, content, productId });
    await newReview.save();

    // notify the event bus
    channel.sendToQueue(
      "review-created-queue",
      Buffer.from(JSON.stringify(newReview)),
    );
    res.status(201).send(newReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: err.message });
  }
});

app.listen(4001, () => {
  console.log("Reviews Service running at 4001 !");
});
