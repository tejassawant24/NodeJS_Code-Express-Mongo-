const mongoose = require("mongoose");
let joi = require("@hapi/joi");

//Database Structure
let contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    }
});

//Create Model for wrapping
let ContactInfo = mongoose.model("contactinfo", contactSchema);

//Express API Validation
function ValidationError(message) {
    let Schema = joi.object().keys({
        name: joi.string().required().min(2).max(50),
        email: joi.string().unique().required(),
        message: joi.string().required()
    });
    return Schema.validate(message);
}

module.exports = {
    ContactInfo,
    ValidationError
};