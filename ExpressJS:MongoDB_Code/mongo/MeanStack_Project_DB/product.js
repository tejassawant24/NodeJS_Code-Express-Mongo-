const mongoose = require('mongoose');
let joi = require('@hapi/joi');

//Create Database Structure
let subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
let categorySchema = new mongoose.Schema({
    catName: {
        type: String,
        required: true
    },
    subCat: {
        type: subCategorySchema,
        required: true
    }
})
let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    offerPrice: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true
    },
    isTodayOffer: {
        type: Boolean,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
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
})

//Create Model for Wrapping
let Product = mongoose.model('productInfo', productSchema);
let subCategory = mongoose.model('subcathegory', subCategorySchema);
let Category = mongoose.model('cathegory', categorySchema);

//Express API Validation
function subCategoryValidationError(message) {
    let Schema = joi.object().keys({
        name: joi.string().required()
    })
    return Schema.validate(message)
}

function categoryValidationError(message) {
    let Schema = joi.object().keys({
        catName: joi.string().required(),
        subCatId: joi.required()
    })
    return Schema.validate(message);
}

function productValidationError(message) {
    let Schema = joi.object().keys({
        name: joi.string().required(),
        image: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        offerPrice: joi.number().required(),
        isAvailable: joi.boolean().required(),
        isTodayOffer: joi.boolean().required(),
        Category: joi.string().required(),
        subCategory: joi.string().required(),
        isAdmin: joi.boolean().required(),
        recordDate: joi.date().default(Date.now()),
        updateDate: joi.date().default(Date.now())
    })
    return Schema.validate(message);
}

module.exports = {
    Product,
    subCategory,
    Category,
    categoryValidationError,
    productValidationError,
    subCategoryValidationError
};