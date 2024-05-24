const mongoose = require("mongoose")
require("dotenv").config()

exports.connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("DB connected successfully...")
    })
    .catch((err) => {
      console.log("Error: ", err);
      process.exit(1);
    })
}
