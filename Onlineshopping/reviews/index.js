const express = require("express");
const axios = require("axios").default;
const { randomBytes } = require("crypto");

const app = express();

// should be in db
// { ProductID : [{id,content}]}
const reviewsByProductId = {};

app.use(express.json());

// get all reviews
app.get("/products/:id/reviews", (req, res) => {
  res.send(reviewsByProductId[req.params.id] || []);
});

// add new review
app.post("/products/:id/reviews", (req, res) => {
  const reviewId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const reviews = reviewsByProductId[req.params.id] || [];

  // add review to db
  reviews.push({ id: reviewId, content }); // save()
  reviewsByProductId[req.params.id] = reviews;

  // notify the event bus
  axios
    .post("http://localhost:4005/events", {
      type: "ReviewCreated",
      data: { id: reviewId, content, productId: req.params.id },
    })
    .catch(err => console.log(err));
  res.status(201).send(reviews);
});

app.post("/events", (req, res) => {
  console.log("Received Event : ", req.body.type);
  res.send({});
});

app.listen(4001, () => {
  console.log("Reviews Service running at 4001 !");
});
