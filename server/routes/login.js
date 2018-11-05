/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const updateSQL = require('./methods');

router.post('/', function (req, res) {
  /**
   * req.body.check 意为此次请求是检查用户id是否合法
   * req.body.login 意为此次请求是真正的登录请求
   */
  if (req.body.check) {
    checkId(req, res);
  } else if (req.body.login) {
    login(req, res);
  }
});

router.get('/', function (req, res) {
  var session = req.session.users[req.signedCookies.id];
  if (session && session.userAgent === req.headers['user-agent']) {
    getUserData(session.id, res);
  } else {
    return res.send({status: 'error', reason: '未登录'});
  }
  if (session.cookie.maxAge >= Date.now()) {
    session.cookie.maxAge = Date.now() + 1000 * 60 * 60;
  } else {
    delete req.session.users[req.signedCookies.id];
    delete req.session.id[req.body.id];
    return res.send({ status: "error", reason: "超时，请重新登录！" });
  }
});

module.exports = router;


function checkId(req, res) {
  var selectUseId = "select *from user where(id=?)";
  updateSQL(selectUseId, [req.body.id], (err, results) => {
    if (err) {
      res.header(500);
      return console.log('Query user id err:', err.message);
    } else if (results.length) {
      res.send({ flag: false, reason: "This id already exists!" });
    } else {
      res.send({ flag: true,reason: "success!" });
    }
  });
}

function login(req, res) {
  //if user repeat login,delete the session of before;
  let id = req.session.id[req.body.id];
  if (id) {
    delete req.session.users[id];
    delete req.session.id[req.body.id];
  }
  let selectUserData = 'select password from user where(id=?)';
  updateSQL(selectUserData, [req.body.id]).then(results => {
    if (results.length) {
      if (results[0].password == req.body.password) {
        addToSession(req, res);
        res.send({flag: true, reason: 'success!'});
      } else {
        res.send({flag: false, reason: '密码错误!'});
      }
    } else {
      res.send({flag: false, reason: '此用户名不存在！'});
    }
  }).catch(err => {
    res.header(500);
    console.log('Query user err:', err.message);
    return res.send({ reason: 'Server Error. Please try it again later.'});
  });
}

function addToSession(req, res) {
  var user = {
    id: req.body.id,
    name: new Date().getTime() + Math.random(),
    cookie: {
      maxAge: Date.now() + 60 * 60 * 1000
    },
    userAgent: req.headers['user-agent']
  };
  req.session.users[user.name] = user;
  req.session.id[user.id] = {
    name: user.name,
    maxAge: user.cookie.maxAge
  };
  res.cookie('id', user.name, {
    maxAge: 60 * 60 * 1000,
    signed: true
  });
}

function getUserData(id, res) {
  var selectUserId = 'select id,name,image,style,phone,eMail from user where(id=?)';
  updateSQL(selectUserId, [id]).then(results => {
    res.send({ userInformation: results[0], flag: true });
  }).catch(err => {
    res.header(500);
    console.log('Query user data err:', err.message);
    res.send({ flag: false, reason: 'Server Error!' });
  });
}