const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  post_id: {
    type: BigInt,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  owner_email: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
});

const Post = mongoose.model("post", dataSchema);
module.exports = Post;
