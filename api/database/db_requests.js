module.exports = function(app, pool, cors) {

    //  ----------    / handler    ----------
    app.get('/*/', (req, res, cors) => {
        res.redirect('http://localhost:3000/')
    });

    //    ----------    Create order    ----------
    app.post('/add', (req, res, cors) => {
        const idOr = req.body.id_or;
        const phone = req.body.phone;
        const name = req.body.name;
        const address = req.body.address;
        const description = req.body.description;
        const photo = req.body.photo;
        const price = req.body.price;
        const meeting_date_time = req.body.meeting_date_time;
        const executors_count = req.body.executors_count;
        const create_time = req.body.create_time;
        const status = req.body.status;
        const update_time = req.body.update_time;
    
        console.log(req.body);

        const query = 
        `INSERT INTO orders (id_or, phone, name, address, description, photo, price, meeting_date_time, executors_count, create_time, status, update_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        
        pool.query(
            query, [idOr, phone, name, address, description, photo, price, meeting_date_time, 
            executors_count, create_time, status, update_time], 
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

    //    ----------    All orders    ----------
    app.post('/all', (req, res, cors) => {
        console.log(req.body);

        pool.query('SELECT * FROM orders', (err, data) => {
            (err)?res.send(err):res.json({orders: data});
        });
    });

    //    ----------    Update order status    ----------
    app.post('/update_status', (req, res, cors) => {
        const idOr = req.body.id_or;
        const status = req.body.status;
        const update_time = req.body.update_time;
        
        console.log(req.body);

        if (idOr === undefined || status === undefined || update_time === undefined) {
            console.log("Error: /update_status");
            res.status(500).send('Error /update_status')
        } else {
            const query = 'UPDATE orders SET status = ?, update_time = ? WHERE id_or = ?;';

            pool.query(query, [status, update_time, idOr], 
                (err, result, fields) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send(err)
                    } else {
                        res.status(200).send('Order status was successfully updated')
                    }
                }
            );
        }
    });

    //    ----------    Delete completed order    ----------
    app.post('/delete_completed_order', (req, res, cors) => {
        const idOr = req.body.id_or;

        // STATUS CHECKING NEEDED!!!!!!!!!!!!!!!
        console.log(req.body);

        const query = `DELETE FROM orders WHERE status = ? AND id_or = ?`;

        pool.query(query, [idOr], 
            (err, result, fields) => {
                if(err) {
                    console.log(err)
                    res.status(500).send(err)
                } else {
                    res.status(200).send('Completed selected order(s) was successfully deleted')
                }
            }
        );
    });

    //    ----------    Delete completed orderS    ----------
    app.post('/delete_completed_orders', (req, res, cors) => {

        console.log(req.body);

        const query = `DELETE FROM orders WHERE status = 'Выполнено'`;

        pool.query(query, 
            (err, result, fields) => {
                if(err) {
                    console.log(err)
                    res.status(500).send(err)
                } else {
                    res.status(200).send('Completed orders was successfully deleted')
                }
            }
        );
    });
}