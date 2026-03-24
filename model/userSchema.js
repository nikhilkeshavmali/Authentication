const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    require: true,
  },
  useremail: String,
  password: String,
  phone: String,
  createAt: {
    type: Date,
    default: Date.new,
  },
});
module.exports = mongoose.model("insta_user", userSchema);
