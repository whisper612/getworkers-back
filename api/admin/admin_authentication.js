module.exports = function(app, pool, tokenObject) {
    app.post('/admin', function(req, res) {
        const token_client = req.body.token_client;   

        if (token_client === tokenObject.TOKEN){
            console.log('Admin authentication acquired');

            pool.query('SELECT * FROM orders ORDER BY `create_time` DESC LIMIT 1000; SELECT * FROM executors_list ORDER BY `create_time` DESC LIMIT 1000;', 
                (err, data, executors) => {
                    (err)?res.send(err):res.json({orders: ordersData, executors_list: executorsData });
                    console.log(json({orders: ordersData, executors_list: executorsData }));
            });
            
        } else {
            console.log('Admin try to access has been denied');
            res.redirect('/admin');
        }
    });
}