const TokenObject = require('../admin/config.json');

module.exports = function(app, pool, cors) {
    app.post('/admin', function(req, res, cors) {
        const token_client = req.body.token_client;    

        if (token_client === TokenObject.TOKEN){
            console.log('Admin authentication acquired');

            console.log(req.body);

            pool.query('SELECT * FROM orders', (err, data) => {
                res.status(200).json({orders: data});
            });

        } else {
            console.log('Admin try to access has been denied');
            res.status(405).json({orders: [{order_id: ''}]});
            
        }
    });
}