let express = require("express");
let router = express.Router();
let auth = require("../../middleware/auth");
let admin = require("../../middleware/admin");
let cart = require("../../mongo/MeanStack_Project_DB/userCartInfo");

router.get("/allUserCarts", async (req, res) => {
  let allUserCarts = await cart.userCart.find({});
  if (!allUserCarts) {
    return res.status(402).send("No Data Found!");
  }
  res.send({
    allUserCarts
  });
});

router.post("/cartByUser", async (req, res) => {
  let {
    error
  } = await cart.userCartValidationError(req.body);
  if (error) {
    res.status(402).send(error.details[0].message);
  }
  let cartItem = await cart.cartInfo.findOne({
    _id: req.body.cartItemId
  });

  let cartByUser = new cart.userCart({
    userEmail: req.body.userEmail,
    cartItem: {
      _id: cartItem._id,
      prodId: cartItem.prodId,
      name: cartItem.name,
      image: cartItem.image,
      price: cartItem.price,
      quantity: cartItem.quantity,
      totalPrice: cartItem.totalPrice,
      recordDate: Date.now(),
      updateDate: Date.now()
    }
  });

  //Saving Data
  let items = await cartByUser.save();
  res.send({
    message: "User Cart",
    cartByUser: items
  });
});

router.post("/addToCart", async (req, res) => {
  let {
    error
  } = await cart.cartItemValidationError(req.body);
  if (error) {
    return res.status(402).send(error.details[0].message);
  }

  //Avoiding duplications of product
  let dupProd = await cart.cartInfo.findOne({
    prodId: req.body.prodId
  });
  if (dupProd) {
    return res.status(402).send("Product Already in the cart!!");
  }

  let addToCart = new cart.cartInfo({
    prodId: req.body.prodId,
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    quantity: req.body.quantity,
    totalPrice: req.body.totalPrice,
    recordDate: Date.now()
  });

  //Save Data
  let items = await addToCart.save();
  return res.send({
    message: "Product Added Successfully",
    addToCart: items
  });
});

router.put("/updateCart/:_id", async (req, res) => {
  let {
    error
  } = cart.cartItemValidationError(req.body);
  if (error) {
    return res.status(402).send(error.details[0].message);
  }
  let updateCart = await cart.cartInfo.findOne({
    _id: req.params._id
  });
  if (!updateCart) {
    return res.status(402).send("Invalid Cart id");
  }

  updateCart.prodId = req.body.prodId;
  updateCart.name = req.body.name;
  updateCart.image = req.body.image;
  updateCart.price = req.body.price;
  updateCart.quantity = req.body.quantity;
  updateCart.totalPrice = req.body.totalPrice;
  updateCart.updateDate = Date.now();

  //Saving Data
  let items = await updateCart.save();
  return res.send({
    message: "Cart Updated",
    updateCart: items
  });
});

router.delete("/removeCartById/:_id", async (req, res) => {
  let data = await cart.cartInfo.findOne({
    _id: req.params._id
  });
  if (!data) {
    return res.status(402).send("Invalid Cart Id");
  }

  let removeCartById = await cart.cartInfo.findByIdAndRemove({
    _id: req.params._id
  });

  //Saving Data
  let items = await removeCartById.save();
  return res.send({
    message: "Cart Items removed Successfully!!",
    removeCartById: items
  });
});

module.exports = router;