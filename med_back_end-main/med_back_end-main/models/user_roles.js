const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// roles - admin: 1, doc: 2, mid_wife:3, pg_woman:4, donors: 5, general: 6

const dataSchema = new Schema({
  user_id: {
    type: String,
    require: true,
  },
  role: {
    type: Number,
    require: true,
  },
  user_email: {
    type: String,
    require: true,
  },
});

const UserRole = mongoose.model("user_role", dataSchema);
module.exports = UserRole;
