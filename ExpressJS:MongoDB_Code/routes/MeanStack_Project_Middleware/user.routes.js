let express = require("express");
let router = express.Router();
const bcrypt = require("bcryptjs");

let U = require("../../mongo/MeanStack_Project_DB/user");

router.get("/alluser", async (req, res) => {
    let user = await U.User.find({}).select('-userLogin.userPassword');
    if (!user)
        res.status(402).send({
            message: "No data found"
        });

    res.send(user);
});

router.post("/newuser", async (req, res) => {
    let {
        error
    } = U.ValidationError(req.body);
    if (error) {
        return res.status(402).send(error.details[0].message);
    }

    let user = await U.User.findOne({
        "userLogin.userEmail": req.body.userLogin.userEmail
    });
    if (user) {
        return res.status(402).send({
            message: "Email id already exists"
        });
    }

    let data = new U.User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        newsLetterCheck: req.body.newsLetterCheck,
        userLogin: req.body.userLogin,
        termsAcceptCheck: req.body.termsAcceptCheck,
        resetPasswordToken: req.body.resetPasswordToken,
        resetPasswordExpire: req.body.resetPasswordExpire,
        isAdmin: req.body.isAdmin,
        recordDate: req.body.recordDate,
        updateDate: req.body.updateDate
    });

    //Password Encryption
    let salt = await bcrypt.genSalt(10);
    data.userLogin.userPassword = await bcrypt.hash(
        data.userLogin.userPassword,
        salt
    );

    //Date Save
    let items = await data.save();

    //Generate token
    let token = items.UserValidToken();
    res.header('x-auth-token', token).send({
        message: "Registration Successful",
        data: items,
        token: token
    });
});

module.exports = router;