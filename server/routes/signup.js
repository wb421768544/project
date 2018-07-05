/*jshint esversion: 6 */
var mysql = require('mysql');
var express = require('express');
var router = express.Router();

var options = {
  host: "localhost",
  user: "root",
  password: "3.3.0.",
  database: "mydatabase",
  useConnectionPooling: true
};
var client = mysql.createConnection(options);


router.use('/', function (req, res) {
  switch(req.query.action) {
    case 'id': checkId(req.query.val, res); break;
    case 'submit': addToStore(req, res); break;
    default: res.send({flag: false, reson:'wrong actions.'});
  }
});

module.exports = router;

function addToStore(req, res) {
  var data = req.body;
  var insertIntoUserInformation = 'insert into user (id,password,name,phone,eMail,image,style,flag) values (?,?,?,?,?,?,?,?)';
  client.query(insertIntoUserInformation, [data.id, data.password, data.name, data.phone, data.eMail, 'image/default.png', '1', '1'], (err) => {
    if(err){
      return res.send({
        flag: false,
        reason: 'Server Error!'
      });
    }
    res.send({
      flag: true,
      reason: 'sign up success!'
    });
  });
}

function checkId(id, res) {
  var selectId = 'select name from user where(id=?)';
  client.query(selectId, [id], (err, results) => {
    if(err){
      res.send({
        flag: false,
        reason: 'Server Error!'
      });
      return false;
    }
    res.send(results.length == 0 ? 
      {flag: true, reason: 'ID unique'} : 
      {flag: false, reason: 'This user name is exist!'});
    return results.length == 0;
  });
}