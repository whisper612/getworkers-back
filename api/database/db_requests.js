const TokenObject = require('../admin/config.json');

module.exports = function(app, pool, cors) {

    //  ----------    Cannot GET /    ----------
    // app.post('/', (req, res, cors) => {
    //     res.send('Say hi to GetWorkersDev! =3');    
    // });

    //    ----------    Create order    ----------
    app.post('/add', (req, res, cors) => {
        const id = req.body.id;
        const phone = req.body.phone;
        const name = req.body.name;
        const address = req.body.address;
        const description = req.body.description;
        const price = req.body.price;
        const meeting_date = req.body.meeting_date;
        const meeting_time = req.body.meeting_time;
        const executors_count = req.body.executors_count;
        const status = req.body.status;
        const create_time = req.body.create_time;
        const update_time = req.body.update_time;
    
        console.log(req.body);

        const query = 
        `INSERT INTO orders (id, phone, name, address, description, price, meeting_date, meeting_time, executors_count, status, create_time, update_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        
        pool.query(
            query, [id, phone, name, address, description, price, meeting_date, 
            meeting_time, executors_count, status, create_time, update_time], 
            (err, result, fields) => {
                if (err) {
                    console.log(err)
                    res.status(500).send(err)
                } else {
                    res.status(200).send('New order was successfully added')
                }
            }
        );
    });

    //    ----------    All order    ----------
    app.post('/all', (req, res, cors) => {
        console.log(req.body);

        pool.query('SELECT * FROM orders', (err, data) => {
            (err)?res.send(err):res.json({orders: data});
        });
    });

    //    ----------    Update order status    ----------
    app.post('/update_status', (req, res, cors) => {
        const id = req.body.id;
        const status = req.body.status;
        const update_time = req.body.update_time;

        console.log(req.body);

        const query = 'UPDATE orders SET status = ?, update_time = ? WHERE id = ?;';

        pool.query(query, [status, update_time, id], 
            (err, result, fields) => {
                if(err) {
                    console.log(err)
                    res.status(500).send(err)
                } else {
                    res.status(200).send('Order status was successfully updated')
                }
            }
        );
    });

    //    ----------    Delete completed order    ----------
    app.post('/delete_completed', (req, res, cors) => {
        const id = req.body.id;

        console.log(req.body);

        const query = `DELETE FROM orders WHERE status = 'Выполнено' AND id = ?`;

        pool.query(query, [id], 
            (err, result, fields) => {
                if(err) {
                    console.log(err)
                    res.status(500).send(err)
                } else {
                    res.status(200).send('Completed order was successfully deleted')
                }
            }
        );
    });
}