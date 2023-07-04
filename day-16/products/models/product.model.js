const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  id: String,
  title: String,
  price: Number,
  rating: Number,
  likes: Number,
  imageUrl: String,
});

module.exports = Product = mongoose.model("products", ProductSchema);
