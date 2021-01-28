const ping = require('ping');

module.exports =  class Single{
    constructor(io, host){
        this.io = io;
        this.host = host;
        host != null ? this.newConn(host) : null;
    }
    newConn(){
        const host = this.host;
        this.io.on("connection",function(client){
       
            // //This is handle by current connected client 
            setInterval(() => {
                ping.promise.probe(host, {
                    timeout: 10,
                    extra: ['-i', '2'],
                }).then(function (res) {
                
                    client.emit("data", res)
                });
            }, 1000)

            client.on("disconnect",function(){
                console.log("client disconnected",client.id);
            })
        
        })
    }
} 
