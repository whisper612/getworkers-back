module.exports = function(app, pool, tokenObject) {

    app.get(`/loaderio-00337c1174533e077aa1e2658689d79e.txt`, (req, res) => {
        const token = req.params;
        console.log(token);
        res.send('loaderio-00337c1174533e077aa1e2658689d79e')
    });
    
    //  ----------    / handler    ----------
    app.get('/*/', (req, res) => {
        console.log('Johnny, the hackers in the trees!')
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
    
        // console.log(orderId, ',', phone, ',', name, ',', address, ',', description, ',', photo, ',', price, ',', meeting_date_time, ',', executors_count, ',', create_time, ',', status, ',', update_time)
        console.log(req.body);

        if (orderId === undefined || phone === undefined || name === undefined || address === undefined || description === undefined
           || meeting_date_time === undefined || executors_count === undefined || create_time === undefined || status === undefined || update_time === undefined) {
            console.log('Error /add: recieved wrong data');
            res.status(500).send('Error when adding order: recieved wrong data')
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
                        res.status(500).send('Error when adding order: fatal error')
                    } else {
                        res.status(200).send(orderId)
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
            console.log('Error /edit_order: recieved wrong data');
            res.status(500).send('Error when order editing: recieved wrong data')
        } else {
            const query = 
            `UPDATE orders SET phone = ?, name = ?, address = ?, description = ?, price = ?,
            meeting_date_time = ?, executors_count = ?, status = ?, update_time = ? WHERE order_id = ?;`;

            pool.query(
                query, [phone, name, address, description, price, meeting_date_time, 
                executors_count, status, update_time, orderId], 
                (err, result, fields) => {
                    if (err || result.affectedRows < 1) {
                        console.log(err, `Error /edit_order: affected rows ${result.affectedRows} < 1`)
                        res.status(500).send('Error when order editing: fatal error')
                    } else {
                        res.status(200).send('Order was successfully editted')
                    }
                }
            );
        }
    });

    //    ----------    Delete completed order by ID    ----------
    app.post(`/delete_completed_order${tokenObject.delComOrder}`, (req, res) => {
        const orderId = req.body.order_id;

        console.log(req.body);

        if (orderId === undefined) {
            console.log('Error /delete_completed_order: recieved wrong data');
            res.status(500).send('Error when deleting completed order by id: recieved wrong data')
        } else {
            const query = `DELETE FROM orders WHERE status = 'Выполнено' AND order_id = ?`;

            pool.query(query, [orderId], 
                (err, result, fields) => {
                    if(err || result.affectedRows < 1) {
                        console.log(err, `Error /delete_completed_order: affected rows ${result.affectedRows} < 1`)
                        res.status(500).send('Error when deleting completed order: id not found')
                    } else {
                        res.status(200).send('Completed selected order was successfully deleted')
                    }
                }
            );
        }      
    });

    //    ----------    Drop completed orders by status    ----------
    app.post(`/delete_completed_orders${tokenObject.delComOrders}`, (req, res) => {

        console.log(req.body);

        const query = `DELETE FROM orders WHERE status = 'Выполнено'`;

        pool.query(query, 
            (err, result, fields) => {
                if(err || result.affectedRows < 2) {
                    console.log(err, `Error /delete_completed_orders: affected rows ${result.affectedRows} < 2.`)
                    res.status(500).json({result: 0})
                } else {
                    res.status(200).json({result: result.affectedRows})
                }
            }
        );
    });

    //    ----------    Add executor    ----------
    app.post(`/add_executor${tokenObject.addExecReq}`, (req, res) => {
        const executorId = req.body.executor_id;
        const name = req.body.name;
        const phone = req.body.phone;
            
        console.log(req.body);

        if (executorId === undefined || name === undefined || phone === undefined) {
            console.log(executorId, name, phone);
            console.log('Error: /add_executor: recieved wrong data');
            res.status(500).send('Error when adding executor')
        } else {
            const query = 
            `INSERT INTO executors_list (executor_id, name, phone)
            VALUES (?, ?, ?);`;
            
            pool.query(
                query, [executorId, name, phone], 
                (err, result, fields) => {
                    if (err) {
                        console.log(err)
                        res.send('Error when adding executor: fatal error')
                    } else {
                        res.send(executorId)
                    }
                }
            );
    
        }
    });

    //    ----------    Edit executor    ----------
    app.post(`/edit_executor${tokenObject.editExecReq}`, (req, res) => {
        const executorId = req.body.executor_id;
        const name = req.body.name;
        const phone = req.body.phone;
        const orderId = req.body.order_id;
               
        console.log(req.body);

        if (executorId === undefined) {
            console.log('Error: /edit_executor: recieved wrong data');
            res.status(500).send('Error when executor info editing: recieved wrong data')
        } else {
            const query = 
            `UPDATE executors_list SET order_id = ?, name = ?, phone = ? WHERE executor_id = ?;`;

            pool.query(
                query, [orderId, name, phone, executorId], 
                (err, result, fields) => {
                    if (err || result.affectedRows < 1) {
                        console.log(err, `Error: /edit_executor: affected rows ${result.affectedRows} < 1`)
                        res.status(500).send(`Error when executor info editing: fatal error`)
                    } else {
                        res.status(200).send('Executor info was successfully editted')
                    }
                }
            );
        }
    });

    //    ----------    Kick executor by ID   ----------
    app.post(`/kick_executor${tokenObject.kickExecReq}`, (req, res) => {
        const executorId = req.body.executor_id;
                       
        console.log(req.body);

        if (executorId === undefined) {
            console.log('Error: /kick_executor: recieved wrong data');
            res.status(500).send('Error when kick executor: recieved wrong data')
        } else {
            /* in developing */
            res.status(200).send('/* in developing, братан */')
        }
    });   
}