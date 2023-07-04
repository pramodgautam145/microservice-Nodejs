const express = require("express");
const axios = require("axios").default;
const { randomBytes } = require("crypto");

const app = express();

// should be in db
// { ID : {id,title,price},ID:{}}
const products = {};

app.use(express.json());

// routes for products
// get all products
app.get("/products", (req, res) => {
  res.json(products);
});

// adding a new product
app.post("/products", (req, res) => {
    const id = randomBytes(4).toString("hex");
    const { title, price } = req.body;
  
    // save product to db
    products[id] = { id, title, price };
  
    // notify event bus
    axios
      .post("http://localhost:4005/events", {
        type: "ProductCreated",
        data: { id, title, price },
      })
      .catch(err => console.log(err));
    res.status(201).send(products[id]);
  });

  app.post("/events", (req, res) => {
    console.log("Received Event : ", req.body.type);
    res.send({});
  });

  app.listen(4000, () => {
    console.log(`Products Service running at port 4000 !`);
  });