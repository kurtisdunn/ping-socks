const Ping = require('./utils/ping');
const Guid = require('./utils/guid');

let ping;

module.exports = function(app, io){
    app.get('/api/test', function(req, res){
        res.status(200).json({'test': 'test'}) 
    });
    // New Ping!
    app.post('/api/ping', function(req, res){
        const ping = new Ping(io, Guid(), req.body.data);
        res.status(200).json({
            "ping": {
                "id": ping.getguid(), 
                "hosts": req.body.data
            }
        });
    });
    // Update Ping
    app.put('/api/ping', function(req, res){
        res.status(200).json({'test': 'test'}) 
    });
}