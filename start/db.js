const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connect_db = () => {
  mongoose
    .connect(
      "mongodb+srv://paulbabu05:11102005@paul-cluster.4qemp.mongodb.net/Open_Recipe?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB connected successfully...."))
    .catch((err) => {
      console.log("Mongodb connection error: ", err);
      process.exit(1);
    });
};

module.exports = connect_db;
