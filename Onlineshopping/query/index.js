const express = require("express");
const axios = require("axios").default;

const app = express();

const products = {};

app.use(express.json());

// Endpoint for the client to communicate
app.get("/products", (req, res) => {
  res.json(products);
});

// Endpoint for being notified from Event Bus
app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log("Event Received : ", type);

  if (type == "ProductCreated") {
    const { id, title, price } = data;
    products[id] = { id, title, price, reviews: [] };
  } else if (type == "ReviewCreated") {
    // add a review for that product (push)
    const { id, content, productId } = data;
    const product = products[productId];
    product.reviews.push({ id, content });
  }
  console.log("Query", products);
  res.send({});
});

app.listen(4002, () => {
  console.log("Query Service running at port 4002");
});
