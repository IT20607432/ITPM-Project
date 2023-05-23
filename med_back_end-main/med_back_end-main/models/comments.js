const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  post_id: {
    type: String,
    require: true,
  },
  comment_title: {
    type: String,
    require: true,
  },
  owner_id: {
    type: String,
    require: true,
  },
  comment_content: {
    type: String,
    require: true,
  },
});

const Comments = mongoose.model("comment", dataSchema);
module.exports = Comments;
