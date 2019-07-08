const tokenObject = require('../admin/config.json');


module.exports = function(app, pool, cors) {
    app.post('/admin', function(req, res, cors) {
        const token_client = req.body.token_client;   

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

    module.exports = tokenObject;
}