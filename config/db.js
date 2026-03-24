const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/UserDB");
    console.log(mongoose.connection.readyState);
    console.log("DB Connection Successfully Done...");
  } catch (err) {
    console.log(mongoose.connection.readyState);
    console.log("DB Connection Faild..." + err);
  }
};

connection();
module.exports = connection;
