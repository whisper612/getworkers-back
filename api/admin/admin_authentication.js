module.exports = function(app, pool, tokenObject) {
    app.post('/admin', function(req, res) {
        const token_client = req.body.TOKEN;   

        if (token_client === tokenObject.TOKEN){
            console.log('Admin authentication acquired');

            pool.query('SELECT * FROM orders', (err, data) => {
                (err)?res.send(err):res.json({orders: data});
            });
        } else {
            console.log('Admin try to access has been denied');
            res.redirect('/admin');
        }
    });
}