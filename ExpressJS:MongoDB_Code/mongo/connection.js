let mongoose = require("mongoose");


function ConnectToDatabase() {
  //Giving connection to mongoose
  mongoose
    .connect("mongodb://localhost/aavdemo", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("connected to database"))
    .catch(err => console.log("something went wrong", err));
}

module.exports = {
  ConnectToDatabase
};