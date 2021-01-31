const Ping = require('./utils/ping');

let ping;

module.exports = function(app, io){
    app.get('/api/test', function(req, res){
        res.status(200).json({'test': 'test'}) 
    });
    // New Ping!
    app.post('/api/ping', function(req, res){

        console.log(req.body.data);
        // console.log(io);

        
        const ping = new Ping(io, req.body.data);
        // ping.newConn()


        res.status(200).json('success');

    });
    // Update Ping
    app.put('/api/ping', function(req, res){
        res.status(200).json({'test': 'test'}) 

    });
}