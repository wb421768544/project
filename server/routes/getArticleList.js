/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');

var options = {
  host: "localhost",
  user: "root",
  password: "3.3.0.",
  database: "mydatabase",
  useConnectionPooling: true
};
const client = mysql.createConnection(options);

router.get('/', function (req, res) {
  if (req.query.action == 'type') {
    getArticleListByTourist(req, res);
  } else {
    getArticleList(req, res);
  }
});

module.exports = router;

function getArticleListByTourist(req, res) {
  var options = {
    order: req.query.order,
    start: parseInt(req.query.start)
  };
  if (typeof options.start != 'number') {
    return returnError(res);
  } else {
    var selectArticleType = 'select *from article_type';
    client.query(selectArticleType, (err, results) => {
      if (err) {
        return res.send({
          flag: false,
          reason: 'Server Error! Please try again later.'
        });
      }
      var type = results.map((val) => {
        return val.type;
      });
      var flag = true;
      if (type.indexOf(options.order) == -1) {
        flag = false;
      }
      getArticle({
        flag: flag,
        articleType: type
      });
    });
  }

  function getArticle(json) {
    var option = decodeURIComponent(options.order);
    var selectArtcileByStar = `select name,title,type,timer,article_id from article order by star desc limit ?, 20`;
    var selectArtcileByOrder = `select name,title,type,timer,article_id from article where(type='${option}') order by star desc limit ?, 20`;
    client.query(json.flag ? selectArtcileByOrder : selectArtcileByStar, [options.start], (err, results) => {
      if (err) {
        console.log('Query article err:', err.message);
        return res.send({
          flag: false,
          reason: 'Server Error! Please try again later.'
        });
      }
      json.flag = true;
      json.articleList = results;
      res.send(json);
    });
  }
}

function getArticleList(req, res) {
  var options = null;
  try {
    options = {
      order: req.query.order,
      start: parseInt(req.query.start),
      userId: req.session.users[req.signedCookies.id].id,
    };
    var orderList = ['timer', 'star', 'comment'];
    if (orderList.indexOf(options.order) == -1 || typeof options.start != 'number') {
      throw new Error();
    }
  } catch (e) {
    return returnError(res);
  }

  var selectArtcileByOrder = `select name,title,type,timer,article_id,star,comment from article order by ${options.order} desc limit ${options.start}, 20`;
  client.query(selectArtcileByOrder, (err, results) => {
    if (err) {
      return res.send({
        flag: false,
        reason: 'Server Error! Please try again later.'
      });
    }
    getStarArticleId(options.userId, res, {
      flag: true,
      articleList: results
    });
  });
}

function getStarArticleId(userId, res, json) {
  var selectStarArticleId = 'select article_id from stars where(id=?)';
  client.query(selectStarArticleId, [userId], (err, results) => {
    if (err) {
      return res.send({
        flag: false,
        reason: 'Server Error! Please try again later.'
      });
    }
    json.starArticle_id = results;
    res.send(json);
  });
}

function returnError(res) {
  return res.send({
    flag: false,
    reason: 'Wrong request!'
  });
}