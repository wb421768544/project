/*jshint esversion: 6 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const updateSQL = require('./methods');
const router = express.Router();

router.use('/', function (req, res) {
  let session = req.session.users[req.signedCookies.id];
  if (!session) {
    return res.send({ flag: false, reason: "未登录！" });
  }
  switch (req.query.action) {
    case "image": uploadImg(req, res); break;
    case "update": updateArticle(req, res); break;
    case "article": uploadArt(req, res, session.id); break;
    default: res.send({ flag: false, reason: "wrong action." });
  }
});

module.exports = router;


function updateArticle(req, res) {
  let artval = req.body;

  if (!filterIllegal(artval.type, 'type')) {
    return res.send({ flag: false, reason: "article type doesn't exist."});
  } else if (       //去掉空格和回车是否为空串
    !filterIllegal(artval.title, 'title') || 
    !filterIllegal(artval.value, 'value')
  ) {
    return res.send({ flag: false, reason: "title or content is empty" });
  }
  let arrOfStars = [artval.title, artval.type, artval.id];
  let arrOfArt = [artval.title, artval.type, artval.value, artval.id];
  let updateStars = 'update stars set title=?, type=? where(article_id=?)';
  let updateArt = 'update article set title=?, type=?, content=? where(article_id=?)';
  Promise.all([updateSQL(updateStars, arrOfStars), updateSQL(updateArt, arrOfArt)]).then(() => {
    res.send({ flag: true, reason: "update success!" });
  }).catch((err) => {
    res.header(500);
    console.log("update article err:", err.message);
  });
}

function uploadImg(req, res) {
  if (!req.files) {
    return res.send({ flag: false, reason: "file is empty." });
  }
  let file = req.files[0];
  let ext = path.parse(file.originalname).ext;
  let newName = ".\\public\\articles\\art_imgs\\" + file.filename + ext;

  fs.rename(file.path, newName, (err) => {
    if (err) {
      res.header(500);
      console.log("rename art_img err:", err.message);
      return res.send({ flag: false, reason: "upload fail." });
    }
    res.send({ flag: true, url: file.filename + ext });
  });
}

function uploadArt(req, res, id) {
  let artInfo = {
    type: req.body.type,
    title: req.body.title || "",
    value: req.body.value || "",
    timer: req.body.timer || Date.now()
  };
  if (filterIllegal(artInfo.type, 'type')) {
    return res.send({
      flag: false,
      reason: "article type doesn't exist."
    });
  } else if (       //去掉空格和回车是否为空串
    filterIllegal(artInfo.title, 'title') || 
    filterIllegal(artInfo.value, 'value')
  ) {
    return res.send({ flag: false, reason: "title or content is empty" });
  }
  let toDelImgs = req.body["toDelImgs[]"] || [];
  toDelImgs.forEach(val => {
    let path = ".\\public\\articles\\art_imgs\\" + val;
    fs.unlink(path, err => {
      if (err) {
        return console.log("remove img err:", err.message);
      }
      console.log("delete image over!");
    });
  });

  updateSQL('select name from user where(id=?)', [id]).then((results) =>{
      let insertIntoArt = `insert into article 
      (id, name, title, type, content, timer, number, article_id, star, comment, starJSON, commentJSON) 
      values (?,?,?,?,?,?,?,?,?,?,?,?)`;
      let arrOfArt = [id, results[0], artInfo.title, artInfo.type, artInfo.value, artInfo.timer, 0, id + artInfo.timer, 0, 0, "{}", "{}"];
      updateSQL(insertIntoArt, arrOfArt)
        .then(() => {
          res.send({ flag: true, reason: "success!", article_id: id + artInfo.timer });
        }).catch(err => {
          console.log("insert article err:", err.message);
          res.send({ flag: false, reason: 'Server Error!'});
        });
    }).catch(err => {
      res.header(500);
      res.send({ flag: false, reason: 'Server Error!' });
    });
}

function filterIllegal(val, option) {
  let typeArr = ['前端', '数据库', 'OS', '后台', '计算机网络'];
  switch(option) {
    case 'type': return typeArr.indexOf(val) != -1;
    case 'title': ;
    case 'value': return val.replace(/[\r\n]/g, "").trim().length != 0;
    default: throw new Error('Options are not allowed to be empty.');
  }
}