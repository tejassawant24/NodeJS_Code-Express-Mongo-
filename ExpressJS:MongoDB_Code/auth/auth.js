const express = require('express');
const router = express.Router();
const joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const U = require('../mongo/MeanStack_Project_DB/user');

router.post('/auth', async (req, res) => {
    let {
        error
    } = LoginValidationError(req.body);
    if (error) {
        res.status(402).send(error.details[0].message)
    }
    let user = await U.User.findOne({
        'userLogin.userEmail': req.body.userLogin.userEmail
    });
    if (!user) {
        res.status(403).send('invalid Email id');
    }

    let password = await bcrypt.compare(req.body.userLogin.userPassword, user.userLogin.userPassword);
    if (!password) {
        res.status(403).send('invalid password')
    }
    let token = user.UserValidToken();
    if (!token) {
        res.status(402).send('invalid token')
    }

    res.send({
        message: 'Login Successful',
        token: token
    });

})

function LoginValidationError(message) {
    let Schema = joi.object().keys({
        userLogin: {
            userEmail: joi.string().required(),
            userPassword: joi.string().required()
        }
    })
    return Schema.validate(message);
}

module.exports = router;