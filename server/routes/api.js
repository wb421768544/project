/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const updateSQL = require('./methods');

router.get('/', function (req, res) {
  let query = req.query;
    switch (query.require) {
      case 'personal':
        queryUser(query.id, res);
        break;
      case 'stars':
        queryStar(query.id, res);
        break;
      case 'relationship':
        queryRelationship(query.id, req, res);
        break;
      case 'updatestar':
        updateStar(req, res);
        break;
      case 'focus': followPeople(query.id, req, res);
      default:
        res.header(404);
    }
});

module.exports = router;

function followPeople(userId, req, res) {
  let session = req.session.users[req.signedCookies.id];
  if(!session) {
    return res.send({flag: false, reason: '未登录'});
  }
  let id = session.id;
  if(id == userId) {
    return res.send({flag: false, reason: 'You cannot follow yourself.'});
  }
  let selectFollow = 'select id from follow where id=? and concern=?';
  updateSQL(selectFollow, [id, userId]).then(results => {
    if(results.length == 0) {
      let selectUserInfo = 'select id, name, image from user where id=? or id=?';
      updateSQL(selectUserInfo, [userId, id]).then(results => {
        let addToFans = 'insert into fans (id, fan, name, image) values (?,?,?,?)';
        let addToFollow = 'insert into follow (id, concern, name, image) values (?,?,?,?)';
        let i1 = results[0].id == id ? 0 : 1;
        let i2 = i1 == 0 ? 1 : 0;
        console.log(results[i1], results[i2]);
        let arrOfOption = [
          [userId, id, results[i1].name, results[i1].image],
          [id, userId, results[i2].name, results[i2].image]
        ];
        Promise.all([
          updateSQL(addToFans, arrOfOption[0]),
          updateSQL(addToFollow, arrOfOption[1])
        ]).then(() => {
          updateSQL('select concern from follow where id=?', [id]).then(results => {
            res.send({
              flag: true,
              follow: results.map( val => val.concern )
            });
          });
        }).catch(err => {
          res.header(500);
          console.log('err:', err.message);
          res.send({ reason: err.message });
        });
      });
    } else {
      let deleteFollow = 'delete from follow where id=? and concern=?';
      let deleteFans = 'delete from fans where id=? and fan=?';
      Promise.all([
        updateSQL(deleteFollow, [id, userId]),
        updateSQL(deleteFans, [userId, id]),
      ]).then(() => {
        updateSQL('select concern from follow where id=?', [id]).then(results => {
          res.send({
            flag: true,
            follow: results.map( val => val.concern )
          });
        });
      }).catch(err => {
        res.header(500);
        console.log('err:', err.message);
        res.send({ reason: err.message });
      });
    }
  });
}

function updateStar(req, res) {
  let session = req.session.users[req.signedCookies.id];
  if(!session) {
    return res.send({flag: false, reason: '未登录'});
  }
  let id = session.id;
  let article_id = req.query.article_id;
  let selectstarJSON = 'select *from article where(article_id=?)';
  updateSQL(selectstarJSON, [article_id], getStarJSON);

  function getStarJSON(err, results) {
    if (err) {
    }else if(results.length == 0) {
      return res.send({flag: false, reason: 'article does not exist.'});
    }
    
    let num = parseInt(req.query.num);
    let json = JSON.parse(results[0].starJSON);
    let deleteStar = 'delete from stars where(id=? and article_id=?)';
    let updateStarNum = 'update stars set star=? where(article_id=?)';
    let updateArticle = 'update article set starJSON=?, star=? where(article_id=?)';
    let addStar =
    `insert into stars 
    (id, article_id, title, author, type, star, comment, timer, name) 
    values(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    //已经star再次star，未star取消star视为非法操作
    if(!((json[id] && (num < 0)) || (!json[id] && (num > 0)))) {
      return res.send({flag: false, reason: 'Exception' });
    }

    let arrOfPromise = [];
    if (json[id] && (num < 0)) { //unstar
      delete json[id];
      star = parseInt(results[0].star) - 1;
      arrOfPromise.push(updateSQL(deleteStar, [id, article_id]));
    } else if (!json[id] && (num > 0)) {  //star
      json[id] = "1";
      star = parseInt(results[0].star) + 1;
      arrOfPromise.push(updateSQL(addStar, [
        id, article_id, results[0].title, results[0].id,
        results[0].type, (parseInt(results[0].star) + 1) + "",
        results[0].comment, results[0].timer, req.query.name
      ]));
    }
    arrOfPromise.push(updateSQL(updateStarNum, [star, article_id]));
    arrOfPromise.push(updateSQL(updateArticle, [JSON.stringify(json), star, article_id]));
    Promise.all(arrOfPromise).then(() => {
      res.send({flag: true, reason: 'success!'});
    }).catch(err => {
      res.header(500);
      res.send({ reason: err.message });
      console.log('Update star err:', err.message);
    });
  }
}

function queryUser(id, res) {
  let arrOfId = [id];
  let selectFans = 'select fan from fans where(id=?)';
  let selectUserData = 'select name, image, style from user where(id=?)';
  let selectFollows = 'select concern from follow where (id=?)';
  let selectArticle = 'select article_id,type,comment,number,star,timer,title from article where(id=?)';

  Promise.all([
    updateSQL(selectFans, arrOfId),
    updateSQL(selectFollows, arrOfId),
    updateSQL(selectArticle, arrOfId),
    updateSQL(selectUserData, arrOfId)
  ]).then(results => {
    res.setHeader('Content-Type', 'text/json;charset=utf-8');
    let json = {
      data: {
        name: results[3][0].name,
        style: results[3][0].style,
        image: results[3][0].image,
        fans: results[0].map( val => val.fan),
        follow: results[1].map( val => val.concern)
      },
      article: results[2]
    };
    res.send(json);
  }).catch(err => {
    console.log('Query user err:', err.message);
    res.header(500);
  });
}


function queryStar(id, res) {
  let selectStars = 'select *from stars where(id=?)';

  updateSQL(selectStars, [id], (err, results) => {
    if (err) {
      console.log('Query stars err:', err.message);
      return res.header(500);
    }
    res.setHeader('Content-Type', 'text/json;charset=utf-8');
    res.send({
      flag: true,
      stars: results
    });
  });
}


function queryRelationship(id, req, res) {
  let session = req.session.users[req.signedCookies.id];

  let arrOfId = [id];
  let selectFans = "select fan,image,name from fans where(id=?)";
  let selectFollow = "select concern,image,name from follow where(id=?)";

  let arrOfPromise = [updateSQL(selectFans, arrOfId), updateSQL(selectFollow, arrOfId)];
  if(session) {
    let selectSelectFollow = 'select concern from follow where id=?';
    arrOfPromise.push(updateSQL(selectSelectFollow, [session.id]));
  }
  Promise.all(arrOfPromise).then(results => {
    let data = {
      fans: results[0],
      follow: results[1]
    };
    if(results[2]) {
      data.selfFollow = results[2].map( val => val.concern );
    }
    res.send(data);
  }).catch(err => {
    console.log('Query relationship err:', err.message);
    res.send({falg: false, reason: 'Server Error.'});
  });
}