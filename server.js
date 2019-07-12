// modules import
const express = require('express');
const expressQueue = require('express-queue');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const tokenObject = require('./api/admin/config.json');

// bot init
const telegrafObject = require('telegraf');
const bot = new telegrafObject(tokenObject.botTOKEN);
const telegramObject = require('telegraf/telegram');
const telegramApi = new telegramObject(tokenObject.botTOKEN);

// server init
const app = express();
const PORT = (process.env.PORT || 5000);
// set server requests queue
app.use(expressQueue({ activeLimit: 9, queuedLimit: 15000 }));

// Database connect
var pool = mysql.createPool({
    multipleStatements: tokenObject.multipleStatements,
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// server modules routes
require('./api/cors/cors_route')(app)
require('./api/admin/admin_authentication')(app, pool, tokenObject)
require('./api/bot/bot')(bot, telegramApi, tokenObject)
require('./api/database/db_requests')(app, pool, telegramApi, tokenObject) 

// server logs
let logsCounter = 0;
const serverLogs = setTimeout (function serverLogs() {    
    const logs = (`Server is running on port ${PORT}`);
    console.log(logs + `.`.repeat(logsCounter++));
    logsCounter %= 6;

    setTimeout(serverLogs, 3000);
}, 100);

// port listen
app.listen(PORT, () => serverLogs);
