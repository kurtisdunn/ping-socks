const ping = require('ping');

module.exports =  class Ping{
    constructor(io, guid, hosts){
        this.io = io;
        this.guid = guid;
        this.hosts = hosts;
        this.startPing = undefined;
        hosts != null ? this.newConn(hosts) : null;
    }
    getguid(){
        return this.guid;
    }
    terminate(){
        clearInterval(this.startPing);
        console.log("client disconnected: ",client.id);
    }
    newConn(){
        const that = this;
        const hosts = this.hosts;
        const io = this.io;
        const startPing =  setInterval(() => { 
            ping.promise.probe(hosts).then(res => { 
                console.log(res);
                res.host === 'unknown' ? this.terminate : io.emit(res.host, { time: res }); 
            });
        }, 1000)
        // startPing = this.startPing;
        this.startPing = startPing;
        io.on('connect' ,function(client){
            console.log('comm');
            client.on("disconnect",function(){
                console.log('connectdiss');
                clearInterval(startPing);
                this.terminate();
                console.log("client disconnected: ",client.id);
            });
        });
    }
} 
