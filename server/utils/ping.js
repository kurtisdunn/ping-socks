const ping = require('ping');

module.exports =  class Ping{
    constructor(sock, guid, host){
        this.sock = sock;
        this.guid = guid;
        this.host = host;
        this.runningPing = null;
        this.terminatePing = this.terminatePing;
        //Kick off the sequence. 
        if(host != null){
           
            this.socket(host);
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
                res.host === 'unknown' ? this.terminatePing : that.sock.broadcast.emit(res); 
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

            that.startPing(); 
           this.sock.on("disconnect",function(){
                console.log("client disconnected sdfsdafdsa: ", that.sock.id);
                clearInterval(that.runningPing);
                that.terminatePing();
            });
    }
} 
