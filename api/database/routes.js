module.exports = function(app, pool) {

    //    ----------    CORS    ----------
    app.use((req, res, next) => {
        res.header({
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-Requested-With": "XMLHttpRequest",
            "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    })
    next()
    });

    // //    ----------    Cannot GET /    ----------
    app.post('/', (req, res) => {
        res.send('Say hi to GetWorkersDev! =3');        
    });

    //    ----------    all order    ----------
    app.post('/all', (req, res) => {
        pool.query('SELECT * FROM orders', (err, data) => {
            (err)?res.send(err):res.json({orders: data});
        });
    });

    //    ----------    Create order    ----------
    app.post('/add', (req, res) => {
        const id = req.body.id;
        const phone = req.body.phone;
        const name = req.body.name;
        const address = req.body.address;
        const description = req.body.description;
        const meeting_date = req.body.meeting_date;
        const meeting_time = req.body.meeting_time;
        const status = req.body.status;
        const create_time = req.body.create_time;
        const update_time = req.body.update_time;
    
        console.log(req.body);

        const query = 
        `INSERT INTO orders (id, phone, name, address, description, meeting_date, meeting_time, status, create_time, update_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        
        pool.query(query, 
            [id, phone, name, address, description, meeting_date, 
            meeting_time, status, create_time, update_time],
            function(err, result, fields){
                if (err) {
                    console.log(err)
                    res.status(500).send(err)
                } else {
                    res.status(200).send('New order was successfully added')
                }
            }
        );
    });

    //    ----------    Update order status    ----------
    app.post('/update_status', (req, res) => {
        const id = req.body.id;
        const status = req.body.status;
        const update_time = req.body.update_time;        

        const query = 'UPDATE orders SET status = ?, update_time = ? WHERE id = ?;';

        pool.query(query, [status, update_time, id],
            function(err, result, fields) {
                if(err) {
                    console.log(err)
                    res.status(500).send(err)
                } else {
                    res.status(200).send('Order status was successfully updated')
                }
            });
    });

    //    ----------    Delete completed order    ----------
    app.post('/delete_completed', (req, res) => {
        const id = req.body.id;

        const query = `DELETE FROM orders WHERE status = 'Выполнено' AND id = ?`;

        pool.query(query, [id],
            function(err, result, fields) {
                if(err) {
                    console.log(err)
                    res.status(500).send(err)
                } else {
                    res.status(200).send('Completed order was successfully deleted')
                }
            });
    });
}