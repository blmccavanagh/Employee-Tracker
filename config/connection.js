const mysql = require('mysql2');
const util = require('util');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


// look at using async await syntax
// wait till connection, when connected then continue
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
  });

  connection.query = util.promisify(connection.query);

  module.exports = connection;