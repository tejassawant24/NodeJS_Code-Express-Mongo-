const express = require('express');
const router = express.Router();
const Model = require('../mongo/MeanStack_Project_DB/user');
const bcrypt = require('bcryptjs');
const joi = require('@hapi/joi');
router.post('/userpassword/:token', async (req, res) => {
    try {
        let user = await Model.User.findOne({
            resetPasswordtoken: req.params.token,
            resetPasswordExpire: {
                $gt: Date.now()
            }
        })


        if (!user) {
            return res.status(401).send('invalid token id');
        }

        let result = ValidationError(req.body);

        if (result.error) {
            return res.status(403).send(result.error.details[0].message)
        }

        let d = await bcrypt.compare(user.userLogin.userPassword, req.body.userLogin.userPassword)
        if (d) {
            return res.status(403).send({
                message: 'password is same like older please make another password'
            })
        }

        user.userLogin.userPassword = req.body.userLogin.userPassword;
        user.resetPasswordtoken = undefined;
        user.resetPasswordExpire = undefined;

        let salt = await bcrypt.genSalt(10);
        user.userLogin.userPassword = await bcrypt.hash(user.userLogin.userPassword, salt);

        user = await user.save();
        res.send({
            'message': "Password updated",
            'data': user
        });
    } catch (ex) {
        res.send(ex);
    }
});

function ValidationError(error) {
    let Schema = {
        userLogin: {
            userPassword: joi.string().required()
        }
    }
    return Schema.validate(error);
}

module.exports = router;