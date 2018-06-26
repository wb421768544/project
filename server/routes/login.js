/*jshint esversion: 6 */
var mysql = require('mysql');
var express = require('express');
var router = express.Router();

var options = {
  host: "localhost",
  user: "root",
  password: "WANGBING520",
  database: "mydatabase",
  useConnectionPooling: true
};
var client = mysql.createConnection(options);

router.post('/', function (req, res) {
  if (req.body.check) {
    //Check whether id is unique
    checkId(req, res);
  } else if (req.body.login) {
    login(req, res);
  }
});

router.get('/', function (req, res) {
  //keep the conversation
  var session = req.session.users[req.signedCookies.id];
  if (session) {
    getUserData(session.id, res);
  } else {
    res.send({
      status: "error",
      reason: "未登录"
    });
    return ;
  }
  if (session.cookie.maxAge >= Date.now()) {
    session.cookie.maxAge = Date.now() + 1000 * 60 * 60;
  } else {
    delete req.session.users[req.signedCookies.id];
    delete req.session.id[req.body.id];
    res.send({
      status: "error",
      reason: "超时，请重新登录！"
    });
    return;
  }
});


module.exports = router;


function checkId(req, res) {
  var selectUseId = "select *from user where(id=?)";
  client.query(selectUseId, [req.body.id], getUserId);

  function getUserId(err, results) {
    if (err) {
      return console.log('Query user id err:', err.message);
    } else if (results.length) {
      res.send({
        flag: false,
        reason: "This id already exists!"
      });
    } else {
      res.send({
        flag: true,
        reason: "success!"
      });
    }
  }
}

function login(req, res) {
  //if user repeat login,delete the session of before;
  var id = req.session.id[req.body.id];
  if (id) {
    delete req.session.users[id];
    delete req.session.id[req.body.id];
  }
  var selectUserData = "select *from user where(id=?)";
  client.query(selectUserData, [req.body.id], getUserData);

  function getUserData(err, results) {
    if (err) {
      return console.log("Query user err:", err.message);
    }
    if (results.length) {
      if (results[0].password == req.body.password) {
        addToSession(req, res);
        res.send({
          flag: true,
          reason: "success!"
        });
      } else {
        res.send({
          flag: false,
          reason: "Your password is error!"
        });
      }
    } else {
      res.send({
        flag: false,
        reason: "Your user name does not exists!"
      });
    }
  }
}

function addToSession(req, res) {
  var user = {
    id: req.body.id,
    name: new Date().getTime() + Math.random(),
    cookie: {
      maxAge: Date.now() + 60 * 60 * 1000
    }
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
  var selectUserId = "select *from user where(id=?)";
  client.query(selectUserId, [id], function (err, results) {
    if (err) {
      return console.log('Query user data err:', err.message);
    } else {
      let json = results[0];
      delete json.password;
      delete json.phone;
      json.status = "success";
      json.counter = true;
      json.flag = true;
      res.send(json);
    }
  });
}