const mysql2 = require('mysql2');
const mysql2Non = require('mysql2');
const ApiError = require('./errors/ApiError');

let connection = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
}).promise();

// const getConnection = async () => await mysql2.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
// });

const connectionCallback = (errMessage) => {
    return (err, res) => {
        if (err) {
            console.error(err);
        }
    }
}

module.exports = {
    connection,
    connectionCallback,
    // getConnection
}
