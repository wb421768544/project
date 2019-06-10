/*jshint esversion: 6 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const updateSQL = require('./methods');

router.use('/', function (req, res) {
  let option = req.query.action;
  let session = req.session.users[req.signedCookies.id];
  if (session) {
    switch (option) {
      case 'image':
        updateImage(session.id, req, res);
        break;
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

function updateImage(id, req, res) {
  let files = req.files;
  if (files) {
    let file = files[0];
    let img = file.path.substring(0, 14) + id + path.parse(file.originalname).ext;
    let temp = './public/temp/' + file.filename + path.parse(file.originalname).ext;
    let newName = req.query.temp ? temp : img;
    fs.rename(file.path, newName, err => {
      if (err) {
        res.header(500);
        console.log('upload file err:', err.message);
        res.send({ reason: '上传失败!'});
      } else {
        res.send({flag: true, reason: '上传成功!', src: newName.substring(9)});
      }
    });
  } else {
    res.send({flag: false, reason: '上传文件为空!'});
  }
}

function removeComment(id, req, res) {
  let data = {};
  let article_id = req.query.article_id;
  let selectComment = 'select name from comments where(article_id=?)';
  let deleteComment = 'delete from comments where(article_id=? and timer=? and id=?)';
  Promise.all([
    updateSQL(deleteComment, [article_id, req.query.timer, id]),
    updateSQL(selectComment, [article_id])
  ]).then((results) => {
    data.len = results[1].length;
    return updateSQL('select commentJSON from article where(article_id=?)', [article_id]);
  }).then((results) => {
    data.commentJSON = JSON.parse(results[0].commentJSON);
    let updateArr = [];
    let updateArticle = 'update article set comment=? where(article_id=?)';
    let updateStarsComment = 'update stars set comment=? where(article_id=?)';

    if (data.len == 0) {
      updateArticle = 'update article set comment=?, commentJSON=? where(article_id=?)';
      data.commentJSON = JSON.parse(data.commentJSON);
      delete data.commentJSON[id];
      data.commentJSON = JSON.stringify(data.commentJSON);
      updateArr = [data.len, data.commentJSON, article_id];
    } else {
      updateArr = [data.len, article_id];
    }
    Promise.all([
      updateSQL(updateArticle, updateArr),
      updateSQL(updateStarsComment, [data.len, article_id])
    ]).then(() => {
      res.send({ flag: true });
    }).catch(err => {
      res.header(500);
      console.log('update err:', err.message);
      res.send({ reason: err.message });
    });
  }).catch(err => {
    res.header(500);
    console.log('update err:', err.message);
    return res.send({ reason: err.message });
  });
}

function updateComments(id, req, res) {
  if (typeof req.body.content != 'string' || req.body.content.replace(/[\r\n]/g, "").trim().length == 0) {
    return res.send({ flag: false, reason: 'comment should not be empty!' });
  }
  let body = req.body;
  let article_id = req.body.article_id;
  let updateStars = 'update stars set comment=? where(article_id=?)';
  let selectArticle = 'select comment, commentJSON from article where(article_id=?)';
  let updateArticle = 'update article set commentJSON=?, comment=? where(article_id=?)';
  let addToComments = 'insert into comments (article_id, id, content, name, image, timer) values (?,?,?,?,?,?)';
  updateSQL(selectArticle, [article_id]).then(results => {
    let info = {
      comment: parseInt(results[0].comment) + 1,
      commentJSON: JSON.parse(results[0].commentJSON)
    };
    if (!(id in info.commentJSON)) {
      info.commentJSON[id] = "1";
    }
    info.commentJSON = JSON.stringify(info.commentJSON);
    Promise.all([
      updateSQL(updateStars, [info.comment, article_id]),
      updateSQL(updateArticle, [info.commentJSON, info.comment, article_id]),
      updateSQL(addToComments, [article_id, id, body.content, body.name, body.image, body.timer])
    ]).then( () => res.send({ flag: true }) )
      .catch( err => res.send({flag: false, reason: err.message}) );
  }).catch( err => res.send({flag: false, reason: err.message}) );
}

function updateName(id, req, res) {
  let optionArr = [req.query.name, id];
  let updateUserName = 'update user set name=? where(id=?)';
  let updateFansName = 'update fans set name=? where(fan=?)';
  let updateArticle = 'update article set name=? where(id=?)';
  let updateStarName = 'update stars set name=? where(author=?)';
  let updateCommentsName = 'update comments set name=? where(id=?)';
  let updateFollowName = 'update follow set name=? where(concern=?)';
  
  Promise.all([
    updateSQL(updateArticle, optionArr),
    updateSQL(updateUserName, optionArr),
    updateSQL(updateFansName, optionArr),
    updateSQL(updateStarName, optionArr),
    updateSQL(updateFollowName, optionArr),
    updateSQL(updateCommentsName, optionArr)
  ]).then(() => {
    res.send({
      flag: true,
      reason: 'success~'
    });
  }).catch(err => {
    res.header(500);
    console.log('err:', err.message);
    res.send({ reason: err.message });
  });
}