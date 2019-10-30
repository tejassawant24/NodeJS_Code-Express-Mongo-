const express = require('express');
const app = express();
const config = require('config');
app.use(express.json());
let user = require('../ExpressJS:MongoDB_Code/routes/MeanStack_Project_Middleware/user.routes');
let auth = require('./auth/auth');
//Forget Password
let mailer = require('../ExpressJS:MongoDB_Code/routes/sendUsermail');
let forgetPassword = require('./routes/forgotpassword');

//Product Info
let product = require('./routes/MeanStack_Project_Middleware/productInfo.routes')

app.use('/api/consumer', user);
app.use('/api/consumer', auth);
app.use('/api/consumer/chat', mailer);
app.use('/api/consumer/chat', forgetPassword);
app.use('/api', product);

//If user does not have token
if (!config.get('usertoken')) {
    console.log('Fatal error:Something went wrong  please check again');
    process.exit(1);
}

//Connect to Database
let connection = require('./mongo/connection');
connection.ConnectToDatabase();

//Server Create
port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`server working on port number ${port}`);
});