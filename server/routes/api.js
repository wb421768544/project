/*jshint esversion: 6 */
const mysql = require('mysql');
const express = require('express');
const router = express.Router();
var options = { //Option of SQL
  host: 'localhost',
  user: 'root',
  password: '3.3.0.',
  database: 'mydatabase',
  useConnectionPooling: true
};

const client = mysql.createConnection(options);

router.get('/', function (req, res) {
  var option = req.query.require;
  var session = req.session.users[req.signedCookies.id];
  if (session) {
    switch (option) {
      case 'personal':
        queryUser(session.id, res);
        break;
      case 'stars':
        queryStar(session.id, res);
        break;
      case 'relationship':
        queryRelationship(session.id, res);
        break;
      case 'updatestar':
        updateStar(session.id, req, res);
        break;
      default:
        res.send('404');
    }
  } else {
    res.send({
      status: 'error',
      reason: '未登录'
    });
  }
});

module.exports = router;

function updateStar(id, req, res) {
  var article_id = req.query.article_id;
  var selectstarJSON = 'select *from article where(article_id=?)';
  client.query(selectstarJSON, [article_id], getStarJSON);

  function getStarJSON(err, results) {
    if (err) {
    }else if(results.length == 0) {
      return res.send({flag: false, reason: 'article does not exist.'});
    }
    
    var json = JSON.parse(results[0].starJSON);
    var num = parseInt(req.query.num);
    var deleteStar = 'delete from stars where(id=? and article_id=?)';
    var updateStarNum = 'update stars set star=? where(article_id=?)';
    var updateArticle = 'update article set starJSON=?, star=? where(article_id=?)';
    var addStar =
    `insert into stars 
    (id, article_id, title, author, type, star, comment, timer, name) 
    values(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    if(!((json[id] && (num < 0)) || (!json[id] && (num > 0)))) {
      return res.send({
        flag: false,
        reason: 'Exception'
      });
    }

    if (json[id] && (num < 0)) { //unstar
      delete json[id];
      star = parseInt(results[0].star) - 1;
      client.query(deleteStar, [id, article_id], handlerErr);

    } else if (!json[id] && (num > 0)) {  //star
      json[id] = "1";
      star = parseInt(results[0].star) + 1;
      client.query(addStar, [
        id, article_id, results[0].title, results[0].id,
        results[0].type, (parseInt(results[0].star) + 1) + "",
        results[0].comment, results[0].timer, req.query.name
      ], handlerErr);
    }
    client.query(updateArticle, [JSON.stringify(json), star, article_id], handlerErr);
    client.query(updateStarNum, [star, article_id], handlerErr);

    var flag = 0;
    function handlerErr(err) {
      if (err) {
        console.log('Update Star err2:', err.message);
        return res.send({
                 flag: false,
                 reason: err.message
               });
      }
      flag ++;
      if(flag == 3){
        res.send({
          flag: true,
          reason: 'success!'
        });
      }
    }
  }
}

function queryUser(id, res) {
  var counter = 0;
  var info = {
    data: {},
    article: {}
  };

  var selectFans = 'select fan from fans where(id=?)';
  var selectUserData = 'select *from user where(id=?)';
  var selectArticle = 'select article_id,type,comment,number,star,timer,title from article where(id=?)';
  var selectFollows = 'select concern from follow where (id=?)';

  client.query(selectFans, [id], getFans);
  client.query(selectFollows, [id], getFollows);
  client.query(selectArticle, [id], getArticle);
  client.query(selectUserData, [id], getUserData);

  //When all asynchronous operations are completed,then submit
  function whetherToSubmit() {
    if (counter == 4) {
      res.setHeader('Content-Type', 'text/json;charset=utf-8');
      res.send(info);
    }
  }

  //Access to user basic information;
  function getUserData(err, results) {
    if (err) {
      return console.log('query user err:', err.message);
    }
    info.data.image = results[0].image;
    info.data.name = results[0].name;
    info.data.style = results[0].style;
    counter ++;
    whetherToSubmit();
  }

  //Get fans information;
  function getFans(err, results) {
    if (err) {
      console.log('Query fans err:', err.message);
      return;
    }
    info.data.fans = results;
    counter++;
    whetherToSubmit();
  }

  //Access to the information of the people of concerned;
  function getFollows(err, results) {
    if (err) {
      return console.log('Query follow err:', err.message);
    }
    info.data.follow = results;
    counter ++;
    whetherToSubmit();
  }

  //Get article information;
  function getArticle(err, results) {
    if (err) {
      return console.log('Query article err:', err.message);
    }
    info.article = results;
    // delete info.article.content;
    counter ++;
    whetherToSubmit();
  }
}

function queryStar(id, res) {
  var selectStars = 'select *from stars where(id=?)';

  client.query(selectStars, [id], getStars);

  function getStars(err, results) {
    if (err) {
      return console.log('Query stars err:', err.message);
    }
    res.setHeader('Content-Type', 'text/json;charset=utf-8');
    res.send({
      stars: results
    });
  }
}

function queryRelationship(id, res) {
  var selectFans = "select *from fans where(id=?)";
  var selectFollow = "select *from follow where(id=?)";
  var o = {};
  var counter = 0;

  client.query(selectFans, [id], getFans);
  client.query(selectFollow, [id], getFollow);

  function getFans(err, results) {
    if (err) {
      return console.log("Query fans err:", err.message);
    }
    o.fans = results;
    counter ++;
    submit();
  }

  function getFollow(err, results) {
    if (err) {
      return console.log("Query follow err:", err.message);
    }
    o.follow = results;
    counter ++;
    submit();
  }

  function submit() {
    if (counter == 2) {
      res.send(o);
    }
  }
}