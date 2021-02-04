const Ping = require('./utils/ping');
const Guid = require('./utils/guid');

let pings = [];

let sock;


module.exports = function(app, io){
        io.on('connection', function(client){
            console.log('connected');
            sock = client;
            client.on("disconnect",function(){
                console.log("client disconnected: ", client.id);
                pings = [];
            });
        });


    app.get('/api/test', function(req, res){
        res.status(200).json({'test': 'test'}) 
    });

    // New Ping!
    app.post('/api/ping', function(req, res){

        const ping = new Ping(sock, Guid(), req.body.data);
        pings.push(ping)
        const current = pings.filter(r => r.host === 'google.com');
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