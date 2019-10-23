let express = require("express");
let router = express.Router();
let M = require('../../mongo/movie_assignment/movie');
let G = require('../../mongo/movie_assignment/genre')

router.post('/newmovie', async (req, res) => {
    let {
        error
    } = M.ValidationError(req.body);
    if (error) {
        res.status(402).send(error.details[0].message);
    }
    let genre = await G.Genre.findById({
        _id: req.body.genreId
    });
    if (!genre) {
        res.status(402).send({
            message: "invalid id"
        });
    }

    let movie = new M.Movie({
        name: req.body.name,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        price: req.body.price,
        rating: req.body.rating
    });
    //Saving Data
    let items = await movie.save();
    res.send({
        message: "movie added succesfully",
        data: items
    })
})

router.put('/updatemovie/:_id', async (req, res) => {
    let movie = await M.Movie.findOne({
        _id: req.params._id
    });
    let genre = await G.Genre.findById({
        _id: req.body.genreId
    })
    if (!movie) {
        res.status(402).send({
            message: "Invalid id"
        })
    }
    movie.name = req.body.name;
    movie.genre = {
        _id: genre._id,
        name: genre.name
    };
    movie.price = req.body.price;
    movie.rating = req.body.rating;

    //save Data
    items = await movie.save();
    res.send({
        message: "Update Succesfull",
        movie: items
    })
})

router.delete('/removemovie/:_id', async (req, res) => {
    let movie = M.Movie.findById({
        _id: req.params._id
    })
    if (!movie) {
        res.status(402).send({
            message: "Invalid Id"
        })
    }
    let data = await M.Movie.findOneAndRemove({
        _id: req.params._id
    })

    //save data
    items = await data.save();
    res.send({
        message: "Movie removed Successfully",
        data: items
    })

})

router.get('/allmovie', async (req, res) => {
    let movie = await M.Movie.find({

    });

    if (!movie) {
        return res.status(402).send({
            message: "No data found!!"
        });
    }

    res.send(movie);
})

router.get('/moviebyid/:_id', async (req, res) => {
    let movie = await M.Movie.findOne({
        _id: req.params._id
    });

    if (!movie) {
        return res.status(402).send({
            message: "invalid id"
        });
    }

    let data = await M.Movie.findOne({
        id: req.params.id
    });

    let items = await data.save();
    res.send(items);
});


module.exports = router;