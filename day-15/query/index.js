const express = require("express");
const axios = require("axios").default;
const mongoose = require("mongoose");
const ProductsWithReviews = require("./models/productswithreviews.model");
const isAuthenticated = require("pubauthmiddleware");

const app = express();

var channel, connection;

mongoose.connect(
  "mongodb://mongodb:27017/querydb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`Query-Service DB Connected`);
  },
);

app.use(express.json());

// Endpoint for the client to communicate
app.get("/products", isAuthenticated, (req, res) => {
  res.json(ProductsWithReviews.find({}));
});

const amqp = require("amqplib");
var channel, connection;

// Connect to RabbitMQ
async function connectToRabbitMQ() {
  const amqpServer = "amqp://rabbitmq:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("product-created-queue");
  await channel.assertQueue("review-created-queue");
}

connectToRabbitMQ().then(() => {
  channel.consume("product-created-queue", data => {
    // order service queue listens to this queue
    const { newProduct } = JSON.parse(data.content);
    console.log("Received : ", newProduct);
    const newProductWithReviews = new ProductsWithReviews({
      ...newProduct,
      reviews: [],
    });
    newProductWithReviews.save();
    channel.ack(data);
  });
  channel.consume("review-created-queue", async data => {
    // order service queue listens to this queue
    const { id, content, productId } = JSON.parse(data.content);
    console.log("Received : ", id, content, productId);

    let theProduct = ProductsWithReviews.findOne({ id: productId });
    if (theProduct) {
      await ProductsWithReviews.updateOne(
        { id: productId },
        { $push: { reviews: { id, content } } },
      );
    }

    channel.ack(data);
  });
});

app.listen(4002, () => {
  console.log("Query Service running at port 4002");
});
