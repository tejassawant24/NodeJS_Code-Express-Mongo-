const express = require("express");
const app = express();
app.use(express.json());
let customer = require("./routes/CRUD_operation/customerInfo.routes");

app.use("/api/customer", customer);

//Connect to Database
let connection = require("./mongo/connection");
connection.ConnectToDatabase();

//Server Create
port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server working on port number ${port}`);
});
