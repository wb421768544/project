function isLogin(req, res) {
  var session = req.session.users[req.signedCookies.id];
  var id = req.signedCookies.id;

  if (session && session.cookie.maxAge >= Date.now() && session.userAgent === req.headers['user-agent']) {
    session.cookie.maxAge = Date.now() + 1000 * 60 * 60;
    return true;
  } else {
    if (session) {
      delete req.session.id[session.id];
    }
    delete req.session.users[id];
    res.send({
      status: "error",
      reason: "未登录或登录超时，请重新登录！"
    });
    return false;
  }
}

module.exports = isLogin;