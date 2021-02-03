const Ping = require('./utils/ping');
const Guid = require('./utils/guid');

let pings = [];

module.exports = function(app, io){
    app.get('/api/test', function(req, res){
        res.status(200).json({'test': 'test'}) 
    });

    // New Ping!
    app.post('/api/ping', function(req, res){

        const ping = new Ping(io, Guid(), req.body.data);
        pings.push(ping)
        const current = pings.filter(r => r.host === 'google.com');
        console.log('current', current);

        res.status(200).json({
            "ping": {
                "id": ping.getguid(), 
                "hosts": req.body.data
            }
        });
    });
    
    // Update Ping
    app.put('/api/ping', (req, res) => {
        res.status(200).json({ 'test': 'test' });
    });
    
    app.delete('/api/ping', (req, res) => {
        console.log(req.body);
        const ping = pings.filter(r => r.guid === req.body.id);
        ping[0].terminatePing();
    })
}