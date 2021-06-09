const mysql = require('mysql2');
const util = require('util');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// wait till connection, when connected then continue
connection.connect(async (err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
});

// allows use of promises/asycn + await with mysql
connection.query = util.promisify(connection.query);

module.exports = connection;