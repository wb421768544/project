/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const options = {
  host: "localhost",
  user: "root",
  password: "3.3.0.",
  database: "mydatabase",
  useConnectionPooling: true
};
const client = mysql.createConnection(options);

router.use('/', function(req, res){
  queryArticle(req.query.id, res);
});

module.exports = router;

function queryArticle(articleId, res){

  let articleInfor = {};
  let selectArticle = 'select article_id,comment,content,star,timer,title,type,id,starJSON from article where(article_id=?)';

  selectData(selectArticle, [articleId]).then((results) => {
    if(results.length == 0) {
      return res.send({flag: false, reason: 'article doesn\'t exist!'});
    }else {
      let selectAuthor = 'select id,name,image from user where(id=?)';
      let selectComments = 'select *from comments where(article_id=?) order by timer desc';

      Promise.all([selectData(selectAuthor, [results[0].id]), selectData(selectComments, [articleId])])
        .then((results) => {
          articleInfor.author = results[0][0];
          articleInfor.comments = results[1];
          getAuthorInfo(articleInfor, res);
        }).catch((err) => {
          console.log('Query err:', err.message);
          res.send({flag: false, reason: 'Server Error.'});
        });

      articleInfor.articleContent = results[0];
    }
  });

}

function getAuthorInfo(articleInfor, res) {

  var arrOfId = [articleInfor.author.id];
  var selectAllStar = 'select star from stars where(id=?)';
  var selectAllBeStar = 'select star from article where(id=?)';
  var selectArticleNum = 'select star from article where(id=?)';

  Promise.all([selectData(selectAllStar, arrOfId), selectData(selectAllBeStar, arrOfId), selectData(selectArticleNum, arrOfId)])
    .then((results) => {
      let sum = 0;
      results[1].forEach(function(val) {
        sum += parseInt(val.star);
      });
      articleInfor.author.beStarNum = sum;
      articleInfor.author.starNum = results[0].length;
      articleInfor.author.articleNum = results[2].length;
      res.send({flag: true, articleInfor: articleInfor});
    }).catch((err) => {
      console.log('query err:', err.message);
      return res.send({flag: false, reason: 'Server Error.'});
    });

}

function selectData(SQL, arr) {
  return new Promise((resolve, reject) => {
    client.query(SQL, arr, (err, results) => {
      if(err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}