var mysql = require('mysql');
var db_conn = require('./db_conn.json');

const db = mysql.createConnection({
    host    : db_conn.host,
    user    : db_conn.user,
    password    : db_conn.password,
    database    : db_conn.database
});
db.connect();

module.exports = db;