var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var options = {
  host: "localhost",
  user: "root",
  password: "WANGBING520",
  database: "mydatabase",
  useConnectionPooling: true
};
var client = mysql.createConnection(options);

router.use('/', function(req, res) {
  try{
    var id = req.query.id;
    getAuthorInfo(id, req, res);
  }catch(e){
    res.send({flag: false, reason: e});
  }
});



module.exports = router;