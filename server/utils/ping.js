const ping = require('ping');

module.exports =  class Ping{
    constructor(io, hosts){
        this.io = io;
        this.hosts = hosts;
        hosts != null ? this.newConn(hosts) : null;
    }
    newPing(){
        
    }
    newConn(){
        const hosts = this.hosts;
        this.io.on("connection",function(client){
            setInterval(() => {
                hosts.forEach(function (host) {
                    ping.promise.probe(host)
                        .then(function (res) {
                            console.log(res);
                            client.emit("data", host)
                        });
                });
            }, 1000);
 
            client.on("disconnect",function(){
                console.log("client disconnected",client.id);
            });
        })
    }
} 
