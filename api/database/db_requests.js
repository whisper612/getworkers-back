// const Extra = require('telegraf/extra')

module.exports = function(app, pool, telegramApi, tokenObject) {
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
                        if (status === 'Отправлено') {

                            const telegramMsg = `<b>🆔 Номер заказа:</b> <i>${orderId}</i>\n\n🗺️ <b>Куда:</b> <i>${address}</i>\n\n⏰ <b>Когда:</b> <i>${meeting_date_time}</i>\n\n👷 <b>Работников нужно:</b> ${executors_count}\n\n🗒️ <b>Задание:</b> <i>${description}</i>\n\n💵 <b>Стоимость заказа:</b> ${Math.ceil(price * 0.8)}<b>₽</b>`

                            const extra = {
                                parse_mode: `HTML`,
                                reply_markup: JSON.stringify({
                                    inline_keyboard: [
                                        [{text: `🛠️ Взяться за работу`, callback_data: `🛠️`}]
                                    ]
                                })
                            }

                            const query = 'UPDATE orders SET executors_number = 0 WHERE order_id = ?;'

                            pool.query(
                                query, [orderId], 
                            (err, result, fields) => {
                                if (!err) {
                                    telegramApi.sendMessage(tokenObject.chatId, telegramMsg, extra, (ctx) => {
                                        console.log(ctx.update)
                                    })
                                } else {
                                    console.log('Error while sending order')
                                }
                            })
                        }
                    }
                }
            );
        }
    });

    //    ----------    Select order info from orders    ----------
    app.post(`/select_order${tokenObject.selectOrderReq}`, (req, res) => {
        const orderId = req.body.order_id;

        if (orderId === undefined) {
            console.log('Error: /select_order: recieved wrong data');
            res.send('Error when order info selecting: recieved wrong data')
        } else {
        const query = 
            `SELECT name, phone FROM orders WHERE order_id = ?`;

            pool.query(
                query, [orderId], 
                (err, result, fields) => {
                    if (err || result.affectedRows < 1) {
                        console.log(err, `Error: /select_order: affected rows ${result.affectedRows} < 1`)
                        res.send(err)
                    } else {
                        res.send({ check: JSON.stringify(result[0]) })
                    }
                }
            );
        }
    })

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
                        res.send(err)
                    } else {
                        res.send({check: executorId})
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
        var orderId = req.body.order_id;
        
        console.log(req.body);

        // не смотрите сюда, пожалуйста, мне стыдно ;(
        if (orderId == '') {
            const query = `SELECT order_id FROM executors_list WHERE executor_id = ?`
            pool.query(
                query, [executorId],
                (err, result, fields) => {
                    orderId = JSON.parse(JSON.stringify(result[0])).order_id
                    
                    console.log('ORDER IS БЛЯЯЯЯЯЯ', orderId)
                    if (orderId !== undefined) {
                        const query = `SELECT executors_number FROM orders WHERE order_id = ?`
                        pool.query(
                            query, [orderId],
                            (err, result, fields) => {
                                var execNumber = JSON.parse(JSON.stringify(result[0])).executors_number
                                if (execNumber !== undefined) {
                                    execNumber--
                                    const query = `UPDATE orders SET executors_number = ? WHERE order_id = ?`
                                    pool.query(
                                        query, [execNumber, orderId],
                                        (err, result, fields) => {
                                            if (err)
                                            console.log('Всё плохо')
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            );
        }

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
                        res.send(err)
                    } else {
                        const query =
                        res.send({check: executorId, phone, name, orderId})
                    }
                }
            );
        }
    });

    //    ----------    Select order id from executor   ----------
    app.post(`/select_executor${tokenObject.selectExecReq}`, (req, res) => {
        const executorId = req.body.executor_id;

        if (executorId === undefined) {
            console.log('Error: /select_executor: recieved wrong data');
            res.send('Error when executor info selecting: recieved wrong data')
        } else {
        const query = 
            `SELECT order_id FROM executors_list WHERE executor_id = ?`;

            pool.query(
                query, [executorId], 
                (err, result, fields) => {
                    if (err || result.affectedRows < 1) {
                        console.log(err, `Error: /select_executor: affected rows ${result.affectedRows} < 1`)
                        res.send(err)
                    } else {
                        res.send({ check: JSON.stringify(result[0]) })
                    }
                }
            );
        }
    })

    //    ----------    Update executor number from orders   ----------
    app.post(`/update_exec_number${tokenObject.updateExecNum}`, (req, res) => {
        const orderId = req.body.order_id;
        const execNumber = req.body.executors_number;

        if (orderId === undefined || execNumber === undefined) {
            console.log('Error: /update_exec_number: recieved wrong data');
            res.send('Error when executor info selecting: recieved wrong data')
        } else {
        const query = `UPDATE orders SET executors_number = ? WHERE order_id = ?`;

            pool.query(
                query, [execNumber, orderId], 
                (err, result, fields) => {
                    if (err || result.affectedRows < 1) {
                        console.log(err, `Error: /update_exec_number: affected rows ${result.affectedRows} < 1`)
                        res.send(err)
                    } else {
                        res.send('Success')
                    }
                }
            );
        }
    })

    //    ----------    Select executor number from orders   ----------
    app.post(`/select_exec_number${tokenObject.selectExecNum}`, (req, res) => {
        const orderId = req.body.order_id;

        if (orderId === undefined) {
            console.log('Error: /select_exec_number: recieved wrong data');
            res.send('Error when executor info selecting: recieved wrong data')
        } else {
        const query = 
            `SELECT executors_number FROM orders WHERE order_id = ?`;

            pool.query(
                query, [orderId], 
                (err, result, fields) => {
                    if (err || result.affectedRows < 1) {
                        console.log(err, `Error: /select_exec_number: affected rows ${result.affectedRows} < 1`)
                        res.send(err)
                    } else {
                        res.send({ check: JSON.stringify(result[0]) })
                    }
                }
            );
        }
    })

//    ----------    Select the first executor   ----------
app.post(`/select_first_exec${tokenObject.selectFirstExec}`, (req, res) => {
    const orderId = req.body.order_id + '*';

    if (orderId === undefined) {
        console.log('Error: /select_first_exec: recieved wrong data');
        res.send('Error when executor info selecting: recieved wrong data')
    } else {
    const query = 
        `SELECT name, phone FROM executors_list WHERE order_id = ?`;

        pool.query(
            query, [orderId], 
            (err, result, fields) => {
                if (err || result.affectedRows < 1) {
                    console.log(err, `Error: /select_first_exec: affected rows ${result.affectedRows} < 1`)
                    res.send(err)
                } else {
                    res.send({ check: JSON.stringify(result[0]) })
                }
            }
        );
    }
})

    //    ----------    Update executor order   ----------
    app.post(`/update_executor${tokenObject.updateExecReq}`, (req, res) => {
        const executorId = req.body.executor_id;
        const orderId = req.body.order_id;
               
        console.log(req.body);

        if (executorId === undefined) {
            console.log('Error: /update_executor: recieved wrong data');
            res.send('Error when executor info updating: recieved wrong data')
        } else {
            const query = 
            `UPDATE executors_list SET order_id = ? WHERE executor_id = ?;`;

            pool.query(
                query, [orderId, executorId], 
                (err, result, fields) => {
                    if (err || result.affectedRows < 1) {
                        console.log(err, `Error: /edit_executor: affected rows ${result.affectedRows} < 1`)
                        res.send(err)
                    } else {
                        res.send({check: executorId, orderId})
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
            const until_date = new Date(new Date().getTime() + 3 * 24 * 5 * 60 * 1000);

            telegramApi.kickChatMember(tokenObject.chatId, executorId, until_date)

            const query = 
            `DELETE FROM executors_list WHERE executor_id = ?;`;

            pool.query(
                query, [executorId], 
                (err, result, fields) => {
                    if (err || result.affectedRows < 1) {
                        console.log(err, `Error: /edit_executor: affected rows ${result.affectedRows} < 1`)
                        res.status(500).send(err)
                    } else {
                        res.status(200).send('Successfully deleted and banned from workers chat')
                    }
                }
            );
        }
    });   
}