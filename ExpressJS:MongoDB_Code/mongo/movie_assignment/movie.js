const mongoose = require('mongoose');
let G = require('../movie_assignment/genre')
let joi = require('@hapi/joi');

//Database Structure
let MovieSchema = mongoose.Schema({
    name: {
        type: String,
        min: 5,
        max: 50,
        required: true
    },
    genre: {
        type: G.GenreSchema,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }

})

//Create Model For Wrapping
Movie = mongoose.model('movie', MovieSchema);

//Express API Validation
function ValidationError(message) {
    let Schema = joi.object().keys({
        'name': joi.string().min(5).max(50).required(true),
        'genreId': joi.required(),
        'price': joi.number().required(),
        'rating': joi.number().required()
    });
    return Schema.validate(message);
}

module.exports = {
    MovieSchema,
    Movie,
    ValidationError
};