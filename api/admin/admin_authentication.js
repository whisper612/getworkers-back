const TokenObject = require('../admin/config.json');

module.exports = function(app, cors) {
    app.post('/admin', function(req, res, cors) {
        const token_client = req.body.token_client;    

        if (token_client === TokenObject.TOKEN){
            console.log('Admin authentication acquired');

            res.status(200).send('true')
        } else {
            console.log('Пошёл нахуй');
            res.status(500).send('false')
        }
    });
}