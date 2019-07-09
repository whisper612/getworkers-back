// modules import
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const tokenObject = require('./api/admin/config.json');

// bot init
const telegramBot = require('telegraf');
const bot = new telegramBot(tokenObject.botTOKEN);

// server init
const app = express();
const PORT = (process.env.PORT || 5000);

// Database connect
var pool = mysql.createPool({
    multipleStatements: true,
    connectionLimit: tokenObject.connectionLimit,
    host: tokenObject.host,
    user: tokenObject.user,
    password: tokenObject.password,
    database: tokenObject.database
})

// DB connection logs
pool.on('acquire', function(connection) {
    console.log('Connection %d acquired', connection.threadId)
});

// parser init
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// server modules routes
require('./api/cors/cors_route')(app)
require('./api/admin/admin_authentication')(app, pool, tokenObject)
require('./api/bot/bot')(app, bot, pool)
require('./api/database/db_requests')(app, pool, tokenObject)

// server logs
let counter = 0;
const server_logs = setTimeout (function server_logs() {
    
    const logs = (`Server is running on port ${PORT}`);
    console.log(logs + `.`.repeat(counter++));
    counter %= 6;

    setTimeout(server_logs, 3000); 
}, 100);

// port listen
app.listen(PORT, () => server_logs);