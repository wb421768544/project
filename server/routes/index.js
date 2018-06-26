/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  if(req.session[req.signedCookies.id]){
    res.send('hi.');
  }else{
    let user  = {
      id: Date.now(),
      name: 'wb',
      age: 20,
      address:  'xy'
    };
    req.secret = 'sessionid';
    req.session[user.id] = user;
    res.cookie('id', user.id, {
      maxAge: 10*60*1000,
      signed: true
    });
    res.render('index', { title: 'Express' });
  }
});

module.exports = router;