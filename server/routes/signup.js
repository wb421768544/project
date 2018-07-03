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


router.post('/', function (req, res) {

});

module.exports = router;

function addToDatabase() {
  
}