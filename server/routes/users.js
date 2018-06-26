/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.user) {
    let user = req.session.user;
    let name = user.name;
    res.send('Hello' + name + ', welcome to my home!');
  }else{
    res.send('You should login first!');
  }
});

module.exports = router;
