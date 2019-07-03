const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Serve the static files from the React app
// app.use(express.static(path.join(__dirname, 'client/build')));

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

// connection logs
pool.on('acquire', function(connection) {
    console.log('Connection %d acquired', connection.threadId)
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./api/database/routes')(app, pool)
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
