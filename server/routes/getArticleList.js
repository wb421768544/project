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

router.get('/', function(req, res) {
  var order = req.query.order;
  var start = parseInt(req.query.start);
  var orderList = ['timer', 'star', 'comment'];
  if(orderList.indexOf(order) == -1) {
    res.send({
      flag: false,
      reason: 'No such request is supported!'
    });
  }else if(typeof start != 'number'){
    res.send({
      flag: false,
      reason: 'Wrong request!'
    });
  }else{
    getArticleList(req, res, order, start);
  }
});

module.exports = router;

function getArticleList(req, res, order, start) {
  var selectArtcileByOrder = `select name,title,type,timer,article_id,star,comment from article order by ${order} desc limit ${start}, 20`;
  client.query(selectArtcileByOrder, getArticleList);
  function getArticleList(err, results) {
    if(err){
      return res.send({
        flag: false,
        reason: 'Server Error! Please try again later.'
      });
    }
    getStarArticleId(req, res, {
      flag: true,
      articleList: results
    });
  }
}


function getStarArticleId(req, res, json) {
  var id = req.session.users[req.signedCookies.id];
  console.log(id);
  console.log(req.signedCookies.id);
  console.log(req.session.users);
  // var selectStarArticleId = 'select article_id from stars where(id=?)';
  // client.query(selectStarArticleId, [id], (err, results) => {
  //   if(err) {
  //     return res.send({
  //       flag: false,
  //       reason: 'Server Error! Please try again later.'
  //     });
  //   }
  //   json.starArticle_id = results;
    res.send(json);
  // });
}