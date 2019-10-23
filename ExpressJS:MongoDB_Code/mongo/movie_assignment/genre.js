const mongoose = require('mongoose');
let joi = require('@hapi/joi');

//Database Structure
let GenreSchema = mongoose.Schema({
    name: {
        type: String,
        min: 5,
        max: 50,
        required: true
    }
})

//Create Model For Wrapping
Genre = mongoose.model('genre', GenreSchema);

//Express API Validation
function ValidationError(message) {
    let Schema = joi.object().keys({
        'name': joi.string().min(5).max(50).required(true)
    });
    return Schema.validate(message);
}

module.exports = {
    GenreSchema,
    Genre,
    ValidationError
};