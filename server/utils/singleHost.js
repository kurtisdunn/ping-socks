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
            console.log("client is ",client.id);
            // //This is handle by current connected client 
            client.emit('messages',{hello:'world'});
            setInterval(() => {
                ping.promise.probe(host, {
                    timeout: 10,
                    extra: ['-i', '2'],
                }).then(function (res) {
                    console.log(res)
                    client.emit("data", res)
                });
            }, 3000)

            client.on("disconnect",function(){
                console.log("client disconnected",client.id);
            })
        
        })
    }
} 