//update user information
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
var router = express.Router();

var options = { //Option of SQL
  host: 'localhost',
  user: 'root',
  password: 'WANGBING520',
  database: 'mydatabase',
  useConnectionPooling: true
};
var client = mysql.createConnection(options);

router.use('/', function (req, res) {
  var option = req.query.action;
  var session = req.session.users[req.signedCookies.id];
  if (session) {
    switch (option) {
      case 'image':
        updateImage(session.id, req, res);
        break;
        // case 'password': ;break;
        //case 'phone': ;break;
        // case 'email': ;break;
      case 'comment':
        updateComments(session.id, req, res);
        break;
      case 'name':
        updateName(session.id, req, res);
        break;
      case 'delete':
        removeComment(session.id, req, res);
        break;
    }
  } else {
    res.send({
      status: "error",
      reason: "未登录"
    });
  }
});

module.exports = router;

function removeComment(id, req, res) {

  var article_id = req.query.article_id;
  var selectComment = 'select name from comments where(article_id=?)';
  var deleteComment = 'delete from comments where(article_id=? and timer=? and id=?)';

  client.query(deleteComment, [article_id, req.query.timer, id], function (err) {
    if (err) {
      console.log('delete comment err:', err.message);
      return res.send({
        flag: false,
        reason: err.message
      });
    }
    client.query(selectComment, [article_id], getComments);
  });

  function getComments(err, results) {
    if (err) {
      console.log('query comments err:', err.message);
      return res.send({
        flag: false,
        reason: err.message
      });
    }
    var len = results.length;
    var updateArticle = 'update article set comment=? where(article_id=?)';
    var selectArticle = 'select commentJSON from article where(article_id=?)';

    client.query(selectArticle, [article_id], function (err, results) {
      if (err) {
        console.log('query article err:', err.message);
        return res.send({
          flag: false,
          reason: err.message
        });
      }
      var commentJSON = results[0].commentJSON;
      var updateStarsComment = 'update stars set comment=? where(article_id=?)';
      console.log(len, commentJSON, article_id);
      if (len == 0) {
        let updateArticle = 'update article set comment=?, commentJSON=? where(article_id=?)';
        commentJSON = JSON.parse(commentJSON);
        delete commentJSON[id];
        commentJSON = JSON.stringify(commentJSON);
        client.query(updateArticle, [len, commentJSON, article_id], callback);
      } else {
        client.query(updateArticle, [len, article_id], callback);
      }
      client.query(updateStarsComment, [len, article_id]);
    });

    function callback(err) {
      if (err) {
        console.log('update')
        return res.send({
          flag: false,
          reason: err.message
        });
      }
      res.send({
        flag: true
      });
    }
  }
}

//article   comments stars
function updateComments(id, req, res) {
  //content is all space or enter,return false;
  if (typeof req.body.content != 'string' || req.body.content.replace(/[\r\n]/g, "").trim().length == 0) {
    return res.send({
      flag: false,
      reason: 'comment should not be empty!'
    });
  }
  var info = {};
  var counter = 0;
  var body = req.body;
  var article_id = req.body.article_id;
  var updateStars = 'update stars set comment=? where(article_id=?)';
  var selectArticle = 'select comment, commentJSON from article where(article_id=?)';
  var updateArticle = 'update article set commentJSON=?, comment=? where(article_id=?)';
  var addToComments = 'insert into comments (article_id, id, content, name, image, timer) values (?,?,?,?,?,?)';
  client.query(selectArticle, [article_id], getArticle);
  client.query(addToComments, [article_id, id, body.content, body.name, body.image, body.timer], callback);

  function getArticle(err, results) {
    if (err) {
      return res.send({
        flag: false,
        reason: err.message
      });
    }
    info.comment = parseInt(results[0].comment) + 1;
    info.commentJSON = JSON.parse(results[0].commentJSON);
    if (!(id in info.commentJSON)) {
      info.commentJSON[id] = "1";
    }
    info.commentJSON = JSON.stringify(info.commentJSON);
    client.query(updateStars, [info.comment, article_id], callback);
    client.query(updateArticle, [info.commentJSON, info.comment, article_id], callback);
  }

  function callback(err) {
    if (err) {
      return res.send({
        flag: false,
        reason: err.message
      });
    }
    counter ++;
    if (counter == 3) {
      res.send({
        flag: true
      });
    }
  }
}

function updateImage(id, req, res) {
  var files = req.files; //allow update file only 1
  if (files) {
    let file = files[0];
    let img = file.path.substring(0, 14) + id + path.parse(file.originalname).ext;
    let temp = './public/temp/' + file.filename + path.parse(file.originalname).ext;
    let newName = req.query.temp ? temp : img;
    fs.rename(file.path, newName, function (err) {
      if (err) {
        console.log('upload file err:', err.message);
        res.send({
          flag: false,
          reason: '上传失败！'
        });
      } else {
        res.send({
          flag: true,
          reason: '上传成功！',
          src: newName.substring(9)
        });
      }
    });
  } else {
    res.send({
      flag: false,
      reason: '上传文件为空！'
    });
  }
}

function updateName(id, req, res) {
  var flag = 0;
  var name = req.query.name;
  var updateUserName = 'update user set name=? where(id=?)';
  var updateFansName = 'update fans set name=? where(fan=?)';
  var updateStarName = 'update stars set name=? where(author=?)';
  var updateFollowName = 'update follow set name=? where(concern=?)';
  var updateCommentsName = 'update comments set name=? where(id=?)';
  client.query(updateUserName, [name, id], callback);
  client.query(updateFansName, [name, id], callback);
  client.query(updateStarName, [name, id], callback);
  client.query(updateFollowName, [name, id], callback);
  client.query(updateCommentsName, [name, id], callback);

  function callback(err) {
    flag++;
    if (err) {
      res.send({
        flag: false,
        reason: err.message
      });
    } else if (flag == 5) {
      res.send({
        flag: true,
        reason: 'success~'
      });
    }
  }
}