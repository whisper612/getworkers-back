const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// bot init
const tokenObject = require('./api/admin/config.json');
const telegramBot = require('telegraf');
const config = require('./api/admin/config.json');
const bot = new telegramBot(config.botTOKEN);

// server init
const app = express();
const PORT = (process.env.PORT || 5000);

// Database connect
var pool = mysql.createPool({
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

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./api/bot/bot')(app, bot, pool)
require('./api/cors/cors_route')(app)
require('./api/admin/admin_authentication')(app, pool)
require('./api/database/db_requests')(app, pool)

// server logs
let counter = 0;
const server_logs = setTimeout (function server_logs() {
    
    const logs = (`Server is running on port ${PORT}`);
    console.log(logs + `.`.repeat(counter++));
    counter %= 6;

    setTimeout(server_logs, 3000); 
}, 100);

app.listen(PORT, () => server_logs);