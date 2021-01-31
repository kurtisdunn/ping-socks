const Ping = require('./utils/ping');

let ping;

module.exports = function(app, io){
    app.get('/api/test', function(req, res){
        res.status(200).json({'test': 'test'}) 
    });
    // New Ping!
    app.post('/api/ping', function(req, res){

        console.log(req);
      
        
        // Ping = new Ping(io, ['127.0.0.1']);
        


        res.status(200).json('success');

    });
    // Update Ping
    app.put('/api/ping', function(req, res){
        res.status(200).json({'test': 'test'}) 

        Ping
    });
}