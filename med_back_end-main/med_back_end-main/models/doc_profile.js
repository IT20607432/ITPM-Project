const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  user_id: {
    type: String,
    require: true,
  },
  doc_name: {
    type: String,
    require: true,
  },
  registration_number: {
    type: String,
    require: true,
  },
  qualifications: {
    type: String,
    require: true,
  },
  locationData: {
    type: Object,
    required: true,
  },
});

const DocProfile = mongoose.model("doc_profile", dataSchema);
module.exports = DocProfile;
