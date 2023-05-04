const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middleware");
router.post("/join", async (req, res, next) => {
  const { nick, email, password, money } = req.body;
  console.log(nick, email, password, money);
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join/?error=conflict");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      nick,
      email,
      password: hash,
      money: parseInt(money, 10),
    });
    return res.redirect("/");
  } catch (e) {
    console.error(e);
  }
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});
router.get("/logout", isLoggedIn, (req, res, next) => {
  return req.logout((e) => {
    if (e) {
      return res.redirect("/");
    } else {
      return res.status(200).redirect("/");
    }
  });
});
module.exports = router;
