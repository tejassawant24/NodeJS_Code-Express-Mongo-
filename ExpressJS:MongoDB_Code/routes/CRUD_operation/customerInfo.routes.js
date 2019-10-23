const express = require("express");
const router = express.Router();
let U = require("../../mongo/CRUD_operation/customer");

//Create API

//API to add new user
router.post("/newcustomer", async (req, res) => {
    let {
        error
    } = U.ValidationError(req.body);
    if (error) {
        return res.status(402).send(error.details[0].message);
    }

    //Existing EmailId
    let customer = await U.CustomerInfo.findOne({
        "UserLogin.EmailId": req.body.UserLogin.EmailId
    });
    if (customer) {
        return res.status(402).send({
            message: "already email exists"
        });
    }

    //New Customer
    let data = new U.CustomerInfo({
        id: req.body.id,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        UserId: req.body.UserId,
        UserLogin: req.body.UserLogin,
        Address: req.body.Address,
        MobileNo: req.body.MobileNo
    });

    //Saving Data
    let items = await data.save();
    res.send({
        message: "Registration Successful",
        data: items
    });
});

router.put("/updatecustomer/:id", async (req, res) => {
    let {
        error
    } = U.ValidationError(req.body);
    if (error) {
        return res.status(402).send(error.details[0].message);
    }

    let customer = await U.CustomerInfo.findOne({
        id: req.params.id
    });

    if (!customer) {
        return res.status(402).send({
            message: "invalid id"
        });
    }
    customer.id = req.body.id;
    customer.FirstName = req.body.FirstName;
    customer.LastName = req.body.LastName;
    customer.UserId = req.body.UserId;
    customer.UserLogin = req.body.UserLogin;
    customer.Address = req.body.Address;
    customer.MobileNo = req.body.MobileNo;

    //Saving Data
    let items = await customer.save();
    res.send({
        message: "update Successful",
        data: items
    });
});

router.delete('/removecustomer/:id', async (req, res) => {
    let customer = await U.CustomerInfo.findOne({
        id: req.params.id
    });

    if (!customer) {
        return res.status(402).send({
            message: "invalid id"
        });
    }

    let data = await U.CustomerInfo.findOneAndRemove({
        id: req.params.id
    })

    //Saving Data
    let items = await data.save();
    res.send({
        message: "delete Successful",
        data: items
    });
})
router.get('/allcustomer', async (req, res) => {
    let customer = await U.CustomerInfo.find({

    });

    if (!customer) {
        return res.status(402).send({
            message: "No data found!!"
        });
    }

    res.send(customer);
})

router.get('/customerbyid/:id', async (req, res) => {
    let customer = await U.CustomerInfo.findOne({
        id: req.params.id
    });

    if (!customer) {
        return res.status(402).send({
            message: "invalid id"
        });
    }

    let data = await U.CustomerInfo.findOne({
        id: req.params.id
    });

    let items = await data.save();
    res.send(items);
});





module.exports = router;