const TokenObject = require('../admin/config.json');

module.exports = function(app, cors) {
    
    app.post(`/admin_${TokenObject.TOKEN}`, function(req, res, cors) {
            console.log('Admin authentication acquired');

            res.status(200).send('Admin was successfully authenticated')
    });

}