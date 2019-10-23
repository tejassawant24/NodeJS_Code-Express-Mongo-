const mongoose = require("mongoose");
let joi = require("@hapi/joi");
let jwt = require('jsonwebtoken');
let config = require('config');

//Database Structure
let UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        min: 2,
        max: 50,
        required: true
    },
    lastName: {
        type: String,
        min: 2,
        max: 50,
        required: true
    },
    newsLetterCheck: {
        type: Boolean,
        required: true
    },
    userLogin: {
        userEmail: {
            type: String,
            min: 5,
            max: 50,
            required: true,
            unique: true,
        },
        userPassword: {
            type: String,
            required: true
        }
    },
    termsAcceptCheck: {
        type: Boolean,
        required: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    recordDate: {
        type: Date,
        default: Date.now()
    },
    updateDate: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.methods.UserValidToken = function () {
    let token = jwt.sign({
        _id: this._id
    }, config.get('usertoken'));
    return token;
};
//Create Model for Wrapping
let User = mongoose.model("userData", UserSchema);

//Express Api Validation
function ValidationError(message) {
    let Schema = joi.object().keys({
        firstName: joi
            .string()
            .required()
            .min(2)
            .max(50),
        lastName: joi
            .string()
            .required()
            .min(2)
            .max(50),
        newsLetterCheck: joi.boolean().required(),
        userLogin: {
            userEmail: joi.string().required(),
            userPassword: joi.string().required()
        },
        termsAcceptCheck: joi.boolean().required(),
        resetPasswordToken: joi.string(),
        resetPasswordExpire: joi.date(),
        isAdmin: joi.boolean().required(),
        recordDate: joi.date().default(Date.now()),
        updateDate: joi.date().default(Date.now())
    });
    return Schema.validate(message);
}

module.exports = {
    User,
    ValidationError
};