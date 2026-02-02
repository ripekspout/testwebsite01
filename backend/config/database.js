const mysql = require('mysql2');
require('dotenv').config();

// import mysql from 'mysql2';
// import dotenv from 'dotenv';

// dotenv.config();


// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert to promise-based
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('MySQL Database connected successfully!');
    connection.release();
});

module.exports = promisePool;
// export default promisePool;  // ← Not module.exports
