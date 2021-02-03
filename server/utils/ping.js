const ping = require('ping');

module.exports =  class Ping{
    constructor(io, guid, host){
        this.io = io;
        this.guid = guid;
        this.host = host;
        this.runningPing = null;
        this.terminatePing = this.terminatePing;
        //Kick off the sequence. 
        if(host != null){
            this.socket(); 
            this.startPing(host);
        }

    }
    getguid(){
        return this.guid;
    }
    startPing(){
        const that = this;
        const host = this.host;
        const runningPing = setInterval(() => { 
            ping.promise.probe(host).then(res => { 
                console.log(res.host, res.time);
                res.host === 'unknown' ? this.terminate : that.io.emit(res.host, res); 
            });
        }, 1000)
        this.runningPing = runningPing;
    }
    terminatePing(){
        console.log("terminate");
        clearInterval(this.runningPing);
    }
    socket(){
        const that = this;
        this.io.on('connect' ,function(client){
            client.on("disconnect",function(){
                console.log("client disconnected: ",client.id);
                that.terminatePing();
            });
        });
    }
} 
