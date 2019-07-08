const tokenObject = require('../admin/admin_authentication');

module.exports = function(app, pool) {  
    //  ----------    / handler    ----------
    app.get('/*/', (req, res) => {
        res.send('/');
    });

    //    ----------    Create order    ----------
    app.post(`/add${tokenObject.addReq}`, (req, res) => {

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

        if (orderId === undefined || phone === undefined || name === undefined || address === undefined || description === undefined
           || meeting_date_time === undefined || executors_count === undefined || create_time === undefined || status === undefined || update_time === undefined) {
            console.log("Error: /add");
            res.status(500).send('Error when adding order...')
        } else {
            const query = 
            `INSERT INTO orders (order_id, phone, name, address, description, photo, 
            price, meeting_date_time, executors_count, create_time, status, update_time)
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
    
        }
    });     

    //    ----------    Edit order    ----------
    app.post(`/edit_order${tokenObject.editOrderReq}`, (req, res) => {
        const orderId = req.body.order_id;
        const phone = req.body.phone;
        const name = req.body.name;
        const address = req.body.address;
        const description = req.body.description;
        const price = req.body.price;
        const meeting_date_time = req.body.meeting_date_time;
        const executors_count = req.body.executors_count;
        const status = req.body.status;
        const update_time = req.body.update_time;
        
        console.log(req.body);

        if (orderId === undefined || status === undefined || update_time === undefined) {
            console.log("Error: /edit_order");
            res.status(500).send('Error when order editing...')
        } else {
            const query = 
            `UPDATE orders SET phone = ?, name = ?, address = ?, description = ?, price = ?,
            meeting_date_time = ?, executors_count = ?, status = ?, update_time = ? WHERE order_id = ?;`;

            pool.query(
                query, [phone, name, address, description, price, meeting_date_time, 
                executors_count, status, update_time, orderId], 
                (err, result, fields) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send(err)
                    } else {
                        res.status(200).send('Order was successfully editted')
                    }
                }
            );
        }
    });

    //    ----------    Delete completed order by id   ----------
    app.post(`/delete_completed_order${tokenObject.delComOrder}`, (req, res) => {
        const orderId = req.body.order_id;

        console.log(req.body);

        if (orderId === undefined) {
            console.log("Error: /delete_completed_order");
            res.status(500).send('Error when deleting completed order by id...')
        } else {
            const query = `DELETE FROM orders WHERE status = 'Выполнено' AND order_id = ?`;

            pool.query(query, [orderId], 
                (err, result, fields) => {
                    if(err) {
                        console.log(err)
                        res.status(500).send(err)
                    } else {
                        res.status(200).send('Completed selected order was successfully deleted')
                    }
                }
            );
        }      
    });

    //    ----------    Drop completed orders by status   ----------
    app.post(`/delete_completed_orders${tokenObject.delComOrders}`, (req, res) => {

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