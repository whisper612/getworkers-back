const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = (process.env.PORT || 5000);

// Database connect
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'GetWorkers_Development!612',
    database: 'getworkers'
})
// DB connection logs
pool.on('acquire', function(connection) {
    console.log('Connection %d acquired', connection.threadId)
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const cors = require('./api/cors/cors_route')(app)
require('./api/admin/admin_authentication')(app, cors)
require('./api/database/db_requests')(app, pool, cors)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
