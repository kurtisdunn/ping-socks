const Ping = require('./utils/ping');

let ping;

module.exports = function(app){
    app.get('/api/test', function(req, res){
        res.status(200).json({'test': 'test'}) 
    });
    // New Ping!
    app.post('/api/ping', function(req, res){

        console.log(req, res);
      
        
        // ping = new Ping(io, ['google.com', 'github.com']);

        res.status(200).json(['google.com', 'github.com'] );

    });
    // Update Ping
    app.put('/api/ping', function(req, res){
        res.status(200).json({'test': 'test'}) 

        Ping
    });
}