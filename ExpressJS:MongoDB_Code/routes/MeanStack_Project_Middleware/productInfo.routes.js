const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
let product = require("../../mongo/MeanStack_Project_DB/product");

router.post("/addSubcategory", async (req, res) => {
  let {
    error
  } = product.subCategoryValidationError(req.body);
  if (error) {
    return res.status(402).send(error.details[0].message);
  }

  //To get rid of  duplicate items
  let data = await product.subCategory.findOne({
    name: req.body.name
  });


  if (data) {
    return res.status(402).send({
      message: "Subcategory already Exists"
    });
  }

  //Adding new subCathegories 
  let subCat = new product.subCategory({
    name: req.body.name
  });

  //Saving Data
  let item = await subCat.save();
  res.send({
    message: "Added Successfully",
    data: item
  });
});
router.post("/addCategory", async (req, res) => {
  let {
    error
  } = await product.categoryValidationError(req.body);
  if (error) {
    return res.status(402).send(error.details[0].message)
  }

  //Getting rid of duplicate categories
  let dupCat = await product.Category.findOne({
    'catName': req.body.catName
  });


  if (dupCat) {
    return res.status(402).send({
      message: 'Category already exists'
    })
  }
  console.log(dupCat); //dupCat should be null


  let subCat = await product.subCategory.findOne({
    '_id': req.body.subCatId
  });

  console.log(subCat); //subCat should be null
  if (!subCat) {
    return res.status(402).send('invalid Subcategory id')
  }
  //Adding new Category
  let category = new product.Category({
    catName: req.body.catName,
    subCat: {
      _id: subCat._id,
      name: subCat.name
    }
  });

  //Saving Data
  let items = await category.save();

  res.send({
    message: 'Category Added sucessfully',
    data: items
  })
});

router.get("/allCategory", async (req, res) => {
  let allCat = await product.Category.find({});

  if (!allCat) {
    return res.status(402).send({
      message: "No data found!!"
    });
  }

  res.send(allCat);
});

router.get("/findCategoryById/:_id", async (req, res) => {
  let findCat = await product.Category.findById(req.params._id);

  if (!findCat) {
    return res.status(402).send({
      message: 'no data found!!'
    })
  }

  res.send(findCat);
});

router.delete("/deleteCategoryById/:_id", async (req, res) => {
  let Cat = await product.Category.findOne({
    _id: req.params._id
  });

  if (!Cat) {
    return res.status(402).send({
      message: "invalid id"
    });
  }
  let delCat = await product.Category.findByIdAndRemove({
    _id: req.params._id
  });


  //Saving Data
  let items = await delCat.save();
  res.send({
    message: "delete Successful",
    data: items
  });

});

router.post("/addProduct", async (req, res) => {
  let {
    error
  } = product.productValidationError(req.body);
  if (error) {
    return res.status(402).send(error.details[0].message);
  }

  let item = await product.Product.findOne({
    name: req.body.name
  });
  if (item) {
    return res.status(402).send("product already exists");
  }

  let prodData = new product.Product({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price,
    offerPrice: req.body.offerPrice,
    isAvailable: req.body.isAvailable,
    isTodayOffer: req.body.isTodayOffer,
    Category: req.body.Category,
    subCategory: req.body.subCategory,
    isAdmin: req.body.isAdmin,
    recordDate: req.body.recordDate,
    updateDate: req.body.updateDate
  });

  //Saving Data
  let data = await prodData.save();
  res.send({
    message: "product added succesfully",
    data: data
  });
});

router.put("/updateProduct/:_id", async (req, res) => {
  let {
    error
  } = product.productValidationError(req.body);
  if (error) {
    return res.status(402).send(error.details[0].message);
  }
  let productUpdate = await product.Product.findOne({
    _id: req.params._id
  });
  if (!product) {
    return res.status(402).send("Invalid id");
  }

  productUpdate.name = req.body.name;
  productUpdate.image = req.body.image;
  productUpdate.description = req.body.description;
  productUpdate.price = req.body.price;
  productUpdate.offerPrice = req.body.offerPrice;
  productUpdate.isAvailable = req.body.isAvailable;
  productUpdate.isTodayOffer = req.body.isTodayOffer;
  productUpdate.Category = req.body.Category;
  productUpdate.subCategory = req.body.subCategory;
  productUpdate.isAdmin = req.body.isAdmin;
  productUpdate.recordDate = req.body.recordDate;
  productUpdate.updateDate = req.body.updateDate;

  //Saving Data
  let items = await productUpdate.save();
  res.send({
    message: "Updated Successfully",
    data: items
  });
});

router.delete("/removeProduct/:_id", async (req, res) => {
  let productDelete = await product.Product.findOne({
    _id: req.params._id
  });
  if (!productDelete) {
    return res.send({
      message: "Invalid id"
    });
  }
  let data = await productDelete.findByIdAndRemove({
    _id: req.params._id
  });

  //Saving data
  let item = await data.save();
  res.send({
    message: "Deleted Successfully",
    data: items
  });
});

router.get("/findProductById/:_id", async (req, res) => {
  let prodfind = await product.Product.findOne({
    _id: req.params._id
  });
  if (!prodfind) {
    return res.status(402).send({
      message: "Invalid id"
    });
  }

  let items = await prodfind.save();
  res.send(items);
});

//Product's Pagination
router.get("/pageIndexPagination/:id", async (req, res) => {
  let perPage = 10;
  let page = req.params.id || 1;
  let pageData = await product.Product.find({}).skip((perPage * page) - perPage).limit(perPage);

  let dataCount = await product.Product.find({}).count();
  let totalPages = Math.ceil(dataCount / perPage);

  if (page > totalPages) {
    return res.status(402).send('invalid id')
  }

  res.send({
    perPage: perPage,
    currentPage: page,
    data: pageData,
    dataCount: dataCount,
    totalPages: totalPages
  })
});



router.get("/Category/:Category/Page/:pageIdx", async (req, res) => {
  let Cat = await product
});

// router.get(
//   "/Cathegory/:Cathegory/subCathegory/:subCathegory/Page/:pageIdx",
//   async (req, res) => {}
// );

// router.get("/latestProduct", async (req, res) => {});

// router.get("/offerProduct", async (req, res) => {});

module.exports = router;