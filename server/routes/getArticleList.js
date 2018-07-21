/*jshint esversion: 6 */
const express = require('express');
const updateSQL = require('./methods');
const router = express.Router();


router.get('/', function (req, res) {
  if (req.query.action == 'type') {
    getArticleListByTourist(req, res);
  } else {
    getArticleList(req, res);
  }
});

module.exports = router;

function getArticleListByTourist(req, res) {
  let json = {};
  let options = {
    order: req.query.order,
    start: parseInt(req.query.start)
  };

  if (typeof options.start != 'number') {
    return res.send({ flag: false, reason: 'Wrong request!' });
  } else {
    let selectArticleType = 'select *from article_type';
    updateSQL(selectArticleType).then(results => {
      let type = results.map( val => val.type );
      json = {
        articleType: type,
        flag: type.indexOf(options.order) != -1
      };
      let option = decodeURIComponent(options.order);
      let selectArtcileByStar = `select name,title,type,timer,article_id from article order by star desc limit ?, 20`;
      let selectArtcileByOrder = `select name,title,type,timer,article_id from article where(type='${option}') order by star desc limit ?, 20`;
      return updateSQL(json.flag ? selectArtcileByOrder : selectArtcileByStar, [options.start]);
    }).then(results => {
      json.flag = true;
      json.articleList = results;
      res.send(json);
    }).catch(err => {
      res.header(500);
      console.log('Query article err:', err.message);
      res.send({ reason: 'Server Error! Please try again later...' });
    });
  }
}

function getArticleList(req, res) {
  let options = null;
  try {
    options = {
      order: req.query.order,
      start: parseInt(req.query.start),
      userId: req.session.users[req.signedCookies.id].id,
    };
    let orderList = ['timer', 'star', 'comment'];
    if (orderList.indexOf(options.order) == -1 || typeof options.start != 'number') {
      throw new Error('Unknow action.');
    }
  } catch (e) {
    console.log('err:', e.message);
    return res.send({ flag: false, reason: 'Wrong request!' });
  }

  let selectArtcileByOrder = `select name,title,type,timer,article_id,star,comment from article
    order by ${options.order} desc limit ${options.start}, 20`;

  let data = {};
  updateSQL(selectArtcileByOrder).then(results => {
    data = {
      flag: true,
      articleList: results
    };
    return updateSQL('select article_id from stars where(id=?)', [options.userId]);
  }).then(results => {
    data.starArticle_id = results;
    res.send(data);
  }).catch(err => {
    res.header(500);
    console.log('Something is wrong:', err.message);
    return res.send({ flag: false, reason: 'Server Error! Please try again later.' });
  });
}