const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI;

const connectDb = () => {
  mongoose
    .connect(DB_URI)
    .then(() => console.log("Connected to MongoDB Database"))
    .catch((err) => console.log(err));
};

module.exports = connectDb;
