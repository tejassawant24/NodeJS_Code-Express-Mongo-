let app = require("express");
const mongoose = require("mongoose");
let multer = require("multer");
let router = app.Router();
let model = require("../model/file");
let imgPort = "http://localhost:4000";
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.post("/file", upload.single("image"), async (req, res) => {
  try {
    let fileModel = new model({
      image: imgPort + "/uploads" + req.file.filename
    });
    if (!fileModel) {
      return res.status(403).send("not found file");
    }
    let data = await fileModel.save();

    res.send({
      message: "file uploaded",
      data: data
    });
  } catch (ex) {
    res.send(ex.message);
  }
});

module.exports = router;
