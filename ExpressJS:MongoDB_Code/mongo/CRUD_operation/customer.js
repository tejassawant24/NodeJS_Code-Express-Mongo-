const mongoose = require("mongoose");
let joi = require("@hapi/joi");

//Database structure
let CustomerInfoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    FirstName: {
        type: String,
        min: 5,
        max: 50,
        required: true
    },
    LastName: {
        type: String,
        min: 5,
        max: 50,
        required: true
    },
    UserId: {
        type: String,
        required: true
    },
    UserLogin: {
        EmailId: {
            type: String,
            min: 5,
            max: 50,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    },
    Address: {
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }
    },
    MobileNo: {
        type: String,
        required: true
    }
});

//Create model for wrapping
let CustomerInfo = mongoose.model("customerInfo", CustomerInfoSchema);

//Express API validation
function ValidationError(message) {
    let Schema = joi.object().keys({
        id: joi.number().required(),
        FirstName: joi.string().required().min(5).max(250),
        LastName: joi
            .string()
            .required()
            .min(5)
            .max(250),
        UserId: joi.string().required(),
        UserLogin: {
            EmailId: joi.string().required(),
            password: joi.string().required()
        },
        Address: {
            state: joi.string().required(),
            city: joi.string().required(),
            pincode: joi.string().required()
        },
        MobileNo: joi.string().required()
    });
    return Schema.validate(message);
}

module.exports = {
    CustomerInfo,
    ValidationError
};