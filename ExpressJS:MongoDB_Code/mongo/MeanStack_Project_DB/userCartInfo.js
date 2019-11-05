const mongoose = require('mongoose');
let joi = require('@hapi/joi')

//Databas Structure
let cartItemSchema = new mongoose.Schema({
    prodId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
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

let userCartSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    cartItem: {
        type: cartItemSchema,
        required: true,
        string: true
    }
});

let cartInfo = mongoose.model('cartInfo', cartItemSchema);
let userCart = mongoose.model('usercart', userCartSchema);

//Express Api Validation
function cartItemValidationError(message) {
    let Schema = joi.object().keys({
        prodId: joi.string().required(),
        name: joi.string().required(),
        image: joi.string().required(),
        price: joi.number().required(),
        quantity: joi.number().required(),
        totalPrice: joi.number().required(),
        recordDate: joi.date().default(Date.now()),
        updateDate: joi.date().default(Date.now())
    })
    return Schema.validate(message);
}

function userCartValidationError(message) {
    let Schema = joi.object().keys({
        userEmail: joi.string().required(),
        cartItemId: joi.required()
    })
    return Schema.validate(message);
}

module.exports = {
    cartInfo,
    userCart,
    cartItemValidationError,
    userCartValidationError
}