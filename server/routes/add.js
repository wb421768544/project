/*jshint esversion: 6 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const express = require('express');
const router = express.Router();

var options = {
  //Option of SQL
  host: 'localhost',
  user: 'root',
  password: 'WANGBING520',
  database: 'mydatabase',
  useConnectionPooling: true
};
var client = mysql.createConnection(options);


router.post('/', function (req, res) {
  var session = req.session.users[req.signedCookies.id];
  if (!session) {
    return res.send({
      flag: false,
      reason: "未登录！"
    });
  }
  switch (req.query.action) {
    case "image":
      uploadImg(req, res);
      break;
    case "article":
      uploadArt(req, res, session.id);
      break;
    case "update":
      updateArticle(req, res);
      break;
    default:
      res.send({
        flag: false,
        reason: "wrong action."
      });
  }
});


module.exports = router;


function updateArticle(req, res) {
  var artval = req.body;

  var promise1 = new Promise((resolve, reject) => {
    var updateStars = "update stars set title=?, type=? where(article_id=?)";
    client.query(updateStars, [artval.title, artval.type, artval.id], (err) => {
      if(err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  var promise2 = new Promise((resolve, reject) => {
    var updateArt = "update article set title=?, type=?, content=? where(article_id=?)";
    client.query(updateArt, [artval.title, artval.type, artval.value, artval.id], (err) => {
      if(err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  var promiseList = Promise.all([promise1, promise2]);
  promiseList.then(() => {
    res.send({
      flag: true,
      reason: "update success!"
    });
  }).catch(() => {
    console.log("update article err:", err.message);
    return res.send({
      flag: false,
      reason: err.message
    });
  });
}

function uploadImg(req, res) {
  if (req.files == undefined) {
    return res.send({
      flag: false,
      reason: "file is empty."
    });
  }
  var file = req.files[0];
  var ext = path.parse(file.originalname).ext;
  var newName = ".\\public\\articles\\art_imgs\\" + file.filename + ext;

  fs.rename(file.path, newName, (err) => {
    if (err) {
      console.log("rename art_img err:", err.message);
      return res.send({
        flag: false,
        reason: "upload fail."
      });
    }
    res.send({
      flag: true,
      url: file.filename + ext
    });
  });
}

function uploadArt(req, res, id) {
  var artInfo = {
    type: req.body.type,
    title: req.body.title || "",
    value: req.body.value || "",
    timer: req.body.timer || Date.now()
  };
  var type = ['前端', 'SQL', 'OS', '后台', '计算机网络'];
  if (type.indexOf(artInfo.type) == -1) {
    return res.send({
      flag: false,
      reason: "article type doesn't exist."
    });
  } else if (       //去掉空格和回车是否为空串
    artInfo.title.replace(/[\r\n]/g, "").trim().length == 0 ||
    artInfo.value.replace(/[\r\n]/g, "").trim().length == 0
  ) {
    return res.send({
      flag: false,
      reason: "title or content is empty"
    });
  }
  var toDelImgs = req.body["toDelImgs[]"] || [];
  toDelImgs.forEach(val => {
    let path = ".\\public\\articles\\art_imgs\\" + val;
    fs.unlink(path, err => {
      if (err) {
        return console.log("remove img err:", err.message);
      }
      console.log("delete image over!");
    });
  });
  var insertIntoArt =
    `insert into article 
    (id, title, type, content, timer, number, article_id, star, comment, starJSON, commentJSON) 
    values (?,?,?,?,?,?,?,?,?,?,?)`;

  client.query(
    insertIntoArt, [
      id,
      artInfo.title,
      artInfo.type,
      artInfo.value,
      artInfo.timer,
      0,
      id + artInfo.timer,
      0,
      0,
      "{}",
      "{}"
    ],
    err => {
      if (err) {
        console.log("insert article err:", err.message);
        res.send({
          flag: false
        });
      } else {
        res.send({
          flag: true,
          reason: "success!",
          article_id: id + artInfo.timer
        });
      }
    }
  );
}