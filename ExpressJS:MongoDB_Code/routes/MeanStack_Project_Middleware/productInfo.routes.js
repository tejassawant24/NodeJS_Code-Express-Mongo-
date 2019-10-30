const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
let product = require('../../mongo/MeanStack_Project_DB/product');

router.post("/addCathegory", [auth, admin], async (req, res) => {});

router.get("/allCathegory", [auth], async (req, res) => {});

router.get("/findCathegoryById/:id", [auth, admin], async (req, res) => {});

router.delete("/deleteCathegoryById/:id", [auth, admin], async (req, res) => {});

router.post("/addProduct", [auth, admin], async (req, res) => {
  let {
    error
  } = product.productValidationError(req.body);
  if (error) {
    return res.status(402).send(error.details[0].message);
  }

  let item = await product.Product.findOne({
    name: req.body.name
  })
  if (item) {
    return res.status(402).send('product already exists')
  }

  let prodData = new product.Product({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price,
    offerPrice: req.body.offerPrice,
    isAvailable: req.body.isAvailable,
    isTodayOffer: req.body.isTodayOffer,
    Cathegory: req.body.Cathegory,
    subCathegory: req.body.subCathegory,
    isAdmin: req.body.isAdmin,
    recordDate: req.body.recordDate,
    updateDate: req.body.updateDate
  });

  //Saving Data
  let data = await prodData.save();
  res.send({
    message: 'product added succesfully',
    data: data
  });

});

router.put('/updateProduct/:_id', async (req, res) => {
  let {
    error
  } = product.productValidationError(req.body);
  if (error) {
    return res.status(402).send(error.details[0].message);
  }
  let productUpdate = await product.Product.findOne({
    '_id': req.params._id
  });
  if (!product) {
    return res.status(402).send('Invalid id');
  }

  productUpdate.name = req.body.name;
  productUpdate.image = req.body.image;
  productUpdate.description = req.body.description;
  productUpdate.price = req.body.price;
  productUpdate.offerPrice = req.body.offerPrice;
  productUpdate.isAvailable = req.body.isAvailable;
  productUpdate.isTodayOffer = req.body.isTodayOffer;
  productUpdate.Cathegory = req.body.Cathegory;
  productUpdate.subCathegory = req.body.subCathegory;
  productUpdate.isAdmin = req.body.isAdmin;
  productUpdate.recordDate = req.body.recordDate;
  productUpdate.updateDate = req.body.updateDate;

  //Saving Data
  let items = await productUpdate.save();
  res.send({
    message: 'Updated Successfully',
    data: items
  })
});

// router.delete("/removeProduct/:id", [auth, admin], async (req, res) => {});

// router.get("/pageIndexPagination", async (req, res) => {});

// router.get("/findProductById", async (req, res) => {});

// router.get("/Cathegory/:Cathegory/Page/:pageIdx", async (req, res) => {});

// router.get(
//   "/Cathegory/:Cathegory/subCathegory/:subCathegory/Page/:pageIdx",
//   async (req, res) => {}
// );

// router.get("/latestProduct", async (req, res) => {});

// router.get("/offerProduct", async (req, res) => {});

module.exports = router;