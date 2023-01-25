const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then((con) => console.log(`Connected to Database: ${con.connection.host}`))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
