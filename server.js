const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = (process.env.PORT || 5000);

// Database connect
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'lt80glfe2gj8p5n2.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    user: 'aa4xx3xp3td9bdcb',
    password: 'fw8fcu12m8iqla3i',
    database: 'jg5x8ocd2kelv8a0'
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

let counter = 0;
const server_logs = setTimeout (function server_logs() {
    
    const logs = (`Server is running on port ${PORT}`);
    console.log(logs + `.`.repeat(counter++));
    counter %= 6;

    setTimeout(server_logs, 3000); 
}, 100);

app.listen(PORT, () => server_logs);