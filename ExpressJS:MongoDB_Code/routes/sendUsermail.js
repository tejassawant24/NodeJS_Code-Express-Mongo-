let nodemailer = require('nodemailer');
let express = require('express');
let router = express.Router();

//To generate temporary token for 1 hour
const crypto = require('crypto');
let Model = require('../mongo/MeanStack_Project_DB/user');


router.post('/usermail', async (req, res) => {
    try {
        //Generating temporary token
        let token = crypto.randomBytes(32).toString('hex');

        let userEmail = await Model.User.findOne({
            'userLogin.userEmail': req.body.userLogin.userEmail
        });

        if (!userEmail) {
            return res.status(401).send({
                message: 'invalid email id'
            });
        }

        userEmail.resetPasswordToken = token;
        userEmail.resetPasswordExpire = Date.now() + 3600000;
        userEmail = await userEmail.save();

        //Application of Node Mailer

        //Create reusable transpoter object using default SMTP transport

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', //from here we are sending the mail
            port: 465,
            secure: true, //true for using 465,write false if you want to use other port.

            auth: {
                //this will be the account through which we will send update password link
                user: "sawanttejas27@gmail.com",
                pass: "deepali123"
            }

        });

        //Checking for user validity
        if (!transporter) {
            res.status(401).send({
                message: 'Something went wrong'
            })
        }

        //setup email data with unicode symbols

        let mailOptions = {
            from: '"TS Apps: sweat_smile:" <sawanttejas27gmail.com', //sender address
            to: userEmail.userLogin.userEmail,
            subject: "Reset Your Password",
            text: "Open this link to change your password http://localhost:4200/forgotpassword/" +
                token
        }

        transporter.sendMail()

        //send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }

            console.log('Message sent : %s', info.messageId);
        });

        res.status(200).send({
            'message': 'message send',
            'token': token,
            'data': userEmail
        });
    } catch (ex) {
        res.status(401).send(ex);
    }



})

module.exports = router;