const TokenObject = require('../admin/config.json');
const tmpObject = ('../tmp.json');

module.exports = function(app, pool) {  
    //  ----------    / handler    ----------
    app.get('/*/', (req, res) => {
        res.redirect('/homepage')
    });

    //    ----------    Create order    ----------
    app.post('/add', (req, res) => {
        const orderId = req.body.order_id;
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
        `INSERT INTO orders (order_id, phone, name, address, description, photo, price, meeting_date_time, executors_count, create_time, status, update_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        
        pool.query(
            query, [orderId, phone, name, address, description, photo, price, meeting_date_time, 
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

    //    ----------    Edit order    ----------
    app.post('/edit_order', (req, res) => {
        const orderId = req.body.order_id;
        const status = req.body.status;
        const update_time = req.body.update_time;
        
        console.log(req.body);

        if (orderId === undefined || status === undefined || update_time === undefined) {
            console.log("Error: /update_status");
            res.status(500).send('Error /update_status')
        } else {
            const query = 'UPDATE orders SET status = ?, update_time = ? WHERE order_id = ?;';

            pool.query(query, [status, update_time, orderId], 
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
    app.post('/delete_completed_order', (req, res) => {
        const orderId = req.body.order_id;

        // STATUS CHECKING NEEDED!!!!!!!!!!!!!!!
        console.log(req.body);

        const query = `DELETE FROM orders WHERE status = 'Выполнено' AND order_id = ?`;

        pool.query(query, [orderId], 
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
    app.post('/delete_completed_orders', (req, res) => {

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