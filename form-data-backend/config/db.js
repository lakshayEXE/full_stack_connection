const mysql = require('mysql');

// Create a single connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Assumes no password for the root user
    database: 'auth_demo'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err; // This will crash the server on a connection error, which is often desired on startup
    }
    console.log("MySQL connected successfully");
});

// Export the connection object
module.exports = db;