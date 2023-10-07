const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
    user: 'your_db_username',
    host: 'localhost',
    database: 'your_db_name',
    password: 'your_db_password',
    port: 5432,
});

app.get('/', (req, res) => {
    pool.query('SELECT NOW()', (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results.rows[0]);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});