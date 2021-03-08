const ping = require('ping');

module.exports = class Ping {
    constructor(io, sock, guid, data) {
        this.io = io;
        this.sock = sock;
        this.guid = guid;
        this.host = data.host;
        this.interval = data.interval ? data.interval : '1'
        this.runningPing = null;
        this.terminatePing = this.terminatePing;
        //Kick off the sequence. 
        if (this.host != null) {
            this.socket(this.host);
        }
    }
    getguid() {
        return this.guid;
    }
    startPing() {
        const that = this;
        const host = this.host;
        const interval = this.interval;
        const timeoutinterval = `${interval}${'000'}`;
        const runningPing = setInterval(() => {
            const timestamp = Date.now();
            ping.promise.probe(host, {
                extra: ['-i', interval]
            }).then(res => {
                // console.log(res.host, res.time);
                res.host === 'unknown' ? this.terminatePing : that.io.emit(host, Object.assign(res, {timestamp, interval: interval}));
            });
        }, timeoutinterval)
        this.runningPing = runningPing;
    }
    terminatePing() {
        console.log("terminate: ", this.guid);
        this.runningPing ? clearInterval(this.runningPing) : null;
        // this.sock.disconnect();
    }
    socket() {
        const that = this;
        that.startPing();
        this.sock.on("disconnect", function () {
            clearInterval(that.runningPing);
            that.terminatePing();
        });
    }
}