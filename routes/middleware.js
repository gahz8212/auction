exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인이 필요합니다.");
    return res.redirect(`/?loginError=${decodeURIComponent(message)}`);
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("이미 로그인이 되어 있습니다.");
    return res.redirect(`/?loginError=${decodeURIComponent(message)}`);
  }
};
