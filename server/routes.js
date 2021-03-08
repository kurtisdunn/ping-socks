const Ping = require('./utils/ping');
const Guid = require('./utils/guid');

let pings = [];
let sock;

module.exports = function(app, io){
    io.on('connection', function(client){
        sock = client;
        client.on("disconnect",function(){
            pings = [];
        });
    });

    app.get('/api/test', function(req, res){
        res.status(200).json({'test': 'test'}) 
    });

    // New Ping!
    app.post('/api/ping', function(req, res){
        const ping = new Ping(io, sock, Guid(), req.body.data);
        pings.push(ping)
        res.status(200).json({
                "id": ping.getguid(), 
                "hosts": req.body.data
            });
    });
    
    // Update Ping
    app.put('/api/ping', (req, res) => {
        res.status(200).json({ 'test': 'test' });
    });
    
    app.delete('/api/ping', (req, res) => {
        const ping = pings.filter(r => r.guid === req.body.id);
        const newPings = pings.filter(r => r.guid != req.body.id);
        ping[0].terminatePing();
        pings = newPings;
        res.status(200).json({
            "pings": newPings.length
        });
    })
}