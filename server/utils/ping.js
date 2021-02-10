const ping = require('ping');

module.exports = class Ping {
    constructor(io, sock, guid, host) {
        this.io = io;
        this.sock = sock;
        this.guid = guid;
        this.host = host;
        this.runningPing = null;
        this.terminatePing = this.terminatePing;
        //Kick off the sequence. 
        if (host != null) {
            this.socket(host);
        }

    }
    getguid() {
        return this.guid;
    }
    startPing() {
        const that = this;
        const host = this.host;
        const runningPing = setInterval(() => {
            ping.promise.probe(host).then(res => {
                // console.log(res.host, res.time);
                res.host === 'unknown' ? this.terminatePing : that.io.emit(host, res);
            });
        }, 1000)
        this.runningPing = runningPing;
    }
    terminatePing() {
        console.log("terminate");
        this.runningPing ? clearInterval(this.runningPing) : null;
        this.sock.disconnect();
    }
    socket() {
        const that = this;
        that.startPing();
        this.sock.on("disconnect", function () {
            // console.log("client disconnected sdfsdafdsa: ", that.sock.id);
            clearInterval(that.runningPing);
            that.terminatePing();
        });
    }
}