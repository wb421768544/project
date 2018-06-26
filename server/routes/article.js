/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');

var options = {
  host: "localhost",
  user: "root",
  password: "WANGBING520",
  database: "mydatabase",
  useConnectionPooling: true
};
const client = mysql.createConnection(options);

router.use('/', function(req, res){
  queryArticle(req.query.id, req, res);
});

module.exports = router;

function queryArticle(articleId, req, res){
  var counter = 0;
  var articleInfor = {};
  var selectArticle = 'select *from article where(article_id=?)';
  var selectAuthor = 'select id,name,image from user where(id=?)';
  var selectComments = 'select *from comments where(article_id=?) order by timer desc';

  client.query(selectArticle, [articleId], getArticle);
  client.query(selectComments,[articleId], getComments);

  function getAuthor(err, results) {
    if(err){
      return res.send({flag: false, reason: err.message});
    }
    articleInfor.author = results[0];
    submit();
  }

  function getArticle(err, results) {
    if(err){
      return res.send({flag: false, reason: err.message});
    }else if(results.length == 0) {
      return res.send({flag: false, reason: 'article doesn\'t exist!'});
    }
    client.query(selectAuthor, [results[0].id], getAuthor);
    articleInfor.articleContent = results[0];
    submit();
  }

  function getComments(err, results) {
    if(err){
      return res.send({flag: false, reason: err.message}); 
    }
    articleInfor.comments = results;
    submit();
  }

  function submit() {
    counter ++;
    if(counter == 3) {
      if(articleInfor.articleContent || articleInfor.comments.length){
        getAuthorInfo(articleInfor, res);
      }else{
        res.send({flag: false, reason: 'this article does not exist'});
      }
    }
  }
}

function getAuthorInfo(articleInfor, res) {
  var counter = 0;
  var id = articleInfor.author.id;
  var selectAllStar = 'select star from stars where(id=?)';
  var selectAllBeStar = 'select star from article where(id=?)';
  var selectArticleNum = 'select star from article where(id=?)';
  
  client.query(selectAllStar, [id], getAllStar);
  client.query(selectAllBeStar, [id], getAllBeStar);
  client.query(selectArticleNum, [id], getArticleNum);

  function getAllStar(err, results) {
    if(err){
      return res.send({flag:false, reason: err.message});
    }
    articleInfor.author.starNum = results.length;
    send();
  }

  function getAllBeStar(err, results) {
    if(err) {
      return res.send({flag: false, reason: err.message});
    }
    var num = 0;
    results.forEach(function(val) {
      num += parseInt(val.star);
    });
    articleInfor.author.beStarNum = num;
    send();
  }

  function getArticleNum(err, results) {
    if(err){
      return res.send({flag: false, reason: err.message});
    }
    articleInfor.author.articleNum = results.length;
    send();
  }

  function send() {
    counter ++;
    if(counter == 3) {
      res.send({flag: true, articleInfor: articleInfor});
    }
  }
}