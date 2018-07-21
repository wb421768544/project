/*jshint esversion: 6 */

const updateSQL = require('./methods');
const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
  try {
    if(!req.query.query) {
      throw new Error('Wrong action.');
    }
    fuzzyQuery(req.query.query.trim(), res);
  } catch(e) {
    res.send({flag: false, reason: e.message});
  }
});

module.exports = router;


function fuzzyQuery (query, res) {
  let keyWords = query.replace(/([%^_]|[\[|\]]){1}(.)*?/g, (match) => {
    return `[${match}]`;
  });
  keyWords = '%' + (keyWords.split('').join('%')) + '%';
  let selectArticleInfo = 'select name,title,type,timer,article_id from article where title like ? order by timer desc limit ?,20';
  //考虑到后面文章增多，滚动条到底部再次请求，每次请求20条，暂时一直从0开始
  updateSQL(selectArticleInfo, [keyWords, 0]).then(results => {
    if(results.length == 0) {
      selectArticleInfo = 'select name,title,type,timer,article_id from article where type like ? order by timer desc limit ?,20';
      updateSQL(selectArticleInfo, [keyWords, 0]).then(results => {
        res.send({flag: true, articleList: results});
      });
    } else {
      res.send({flag: true, articleList: results});
    }
  }).catch(err => {
    res.header(500);
    console.log('err:', err.message);
    res.send({ reason: 'Server Error.' });
  });
}
