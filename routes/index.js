const express = require("express");
const router = express.Router();
const { Auction, Good, User, Image } = require("../models");
router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
router.get("/", async (req, res) => {
  const goods = await Good.findAll({
    include: [{ model: Auction }, { model: Image }],
  });
  console.log(goods);
  return res.render("main", { goods });
});
router.get("/join", (req, res) => {
  return res.render("join");
});
router.get("/auction", (req, res) => {
  return res.render("auction");
});
router.get("/good", (req, res) => {
  return res.render("good");
});
router.post("/good/:id/bid", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const bid = parseInt(req.body.bid, 10);
  const message = req.body.message;
  try {
    const good = await Good.findOne({
      where: { id },
      include: { model: Auction },
      order: [[{ medel: Auction }, "bid", "DESC"]],
    });
    if (good.price >= bid) {
      return res.status(403).send("시작 가격보다 높게 입착해야 합니다.");
    }
    if (new Date(good.createdAt).valueOf() + 24 * 60 * 60 * 1000 < new Date()) {
      return res.status(403).send("경매가 이미 종료 되었습니다.");
    }
    if (good.Auctions[0] && good.Auctions[0].bid >= bid) {
      return res.status(403).send("이전 입찰가보다 높아야 합니다.");
    }
    const result = await Auction.create({
      bid,
      message,
      GoodId: id,
      UserId: req.user.id,
    });
    req.app.get("io").to(req.params.id).emit("bid", {
      bid: result.bid,
      message: result.message,
      nick: req.user.nick,
    });
    return res.send("ok");
  } catch (e) {
    console.error(e);
  }
});
router.get("/good/:id", async (req, res) => {
  const [good, auction] = await Promise.all([
    Good.findOne({
      where: { id: req.params.id },
      include: [{ model: User, as: "Owner" }],
    }),
    Auction.findOne({
      where: { GoodId: req.params.id },
      include: [{ model: User }],
      order: [["bid", "ASC"]],
    }),
  ]);
});
module.exports = router;
