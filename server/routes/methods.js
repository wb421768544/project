const mysql = require('mysql');

let options = { //Option of SQL
  host: 'localhost',
  user: 'root',
  password: '3.3.0.',
  database: 'mydatabase',
  useConnectionPooling: true
};
const client = mysql.createConnection(options);

function updateSQL(SQL, arr, callback) {
  return new Promise((resolve, reject) => {
    client.query(SQL, arr, (err, results) => {
      if(callback) {
        return callback(err, results);
      }
      if(err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = updateSQL;
