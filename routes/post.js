const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Good, Image } = require("../models");
try {
  fs.readdirSync("uploads");
} catch (e) {
  console.log("uploads폴더를 생성 합니다.");
  fs.mkdirSync("uploads");
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      cb(null, path.basename(file.originalname, ext) + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
const upload2 = multer();
router.post("/image", upload.array("images"), async (req, res, next) => {
  try {
    const imageArr = req.files.map((file) => ({
      url: `/img/${file.filename}`,
    }));
    return res.status(200).json(imageArr);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});
router.post("/good", upload2.none(), async (req, res, next) => {
  const { name, price, hidden } = req.body;
  // console.log(name, price, hidden);
  try {
    const good = await Good.create({
      name,
      price: parseInt(price, 10),
      UserId: req.user.id,
    });
    const images = hidden.match(/#[^\s#]*/g);
    // console.log(images);
    if (images) {
      const results = await Promise.all(
        images.map((image) => {
          return Image.create({ GoodId: good.id, image: image.slice(1) });
        })
      );
      console.log(results);
      await good.addImages(results.map((result) => result[0]));
    }

    return res.redirect("/");
  } catch (e) {
    console.error(e);
    return next(e);
  }
});
module.exports = router;
