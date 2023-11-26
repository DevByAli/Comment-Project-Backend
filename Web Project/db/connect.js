const mongoose = require("mongoose");
const createAdminUser = require("./createAdmin");

const connectDB = (url) => {
  const connect = mongoose.connect(url);
  mongoose.connection.on("connected", () => {
    createAdminUser();
  });
  return connect;
};

module.exports = connectDB;
