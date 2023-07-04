const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  id: String,
  content: String,
  productId: String,
});

module.exports = Review = mongoose.model("reviews", ReviewSchema);
