const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductWithReviewsSchema = new Schema({
  id: String,
  title: String,
  price: Number,
  rating: Number,
  likes: Number,
  imageUrl: String,
  reviews: [],
});

module.exports = ProductsWithReviews = mongoose.model(
  "productswithreviews",
  ProductWithReviewsSchema,
);
