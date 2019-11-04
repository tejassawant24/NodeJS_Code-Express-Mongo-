let express = require('express');
let router = express.Router();
let auth = require('../../middleware/auth');
let admin = require('../../middleware/admin');
let cart = require('../../mongo/MeanStack_Project_DB/userCart');

router.get('allUserCarts', async (req, res) => {
    let allUserCarts = await cart.userCart.find({});
    if (!allUserCarts) {
        return res.status(402).send('No Data Found!');
    }
    res.send({
        allUserCarts
    });
})

router.get('cartByUser/:_id', async (req, res) => {
    let userByCart = await cart.userCart.findOne({
        _id: req.params._id
    });
    if (!userByCart) {
        return res.status(402).send('')
    }
})