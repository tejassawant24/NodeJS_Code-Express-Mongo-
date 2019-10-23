let express = require("express");
let router = express.Router();

let G = require("../../mongo/movie_assignment/genre");

router.post("/newgenre", async (req, res) => {
    let {
        error
    } = G.ValidationError(req.body);
    if (error) {
        return res.status(402).send(error.details[0].message);
    }

    //existing Genre
    let genre = await G.Genre.findOne({
        name: req.body.name
    });
    if (genre) {
        return res.status(402).send({
            message: "Genre already Exists"
        });
    }

    //New Genre
    data = new G.Genre({
        name: req.body.name
    });

    //Data save
    items = await data.save();
    res.send({
        message: "Genre Added Successfully",
        data: items
    });
});

router.put("/updategenre/:_id", async (req, res) => {
    let {
        error
    } = G.ValidationError(req.body);
    if (error) {
        return res.status(402).send(error.details[0].message);
    }

    let genre = await G.Genre.findOne({
        _id: req.params._id
    });
    if (!genre) {
        return res.status(402).send({
            message: "invalid id"
        });
    }

    genre.name = req.body.name;

    //Save Data
    items = await genre.save();
    res.send({
        message: "Update Succesful",
        data: items
    });
});

router.delete("/removegenre/:_id", async (req, res) => {
    let genre = await G.Genre.findOneAndRemove({
        _id: req.params._id
    });

    //Data Save
    let items = await genre.save();

    res.send({
        message: "Genre removed sucessfully!!!",
        genre: items
    });
});

router.get("/allgenre", async (req, res) => {
    let genre = await G.Genre.find({

    });
    if (!genre) {
        res.send({
            message: "Data not found"
        })
    }

    res.send(genre);

})

router.get("/genrebyid/:_id", async (req, res) => {
    let genre = await G.Genre.findOne({
        _id: req.params._id
    })
    if (!genre) {
        res.send({
            message: "Invalid id"
        })
    }
    res.send(genre);
})

module.exports = router;