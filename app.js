const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ping = require('ping');
const { timeStamp } = require('console');

class Single{
    constructor(host){
        this.host = host;
        host != null ? this.newConn(host) : null;
    }
    newConn(){
        const host = this.host;
        io.on("connection",function(client){
            console.log("client is ",client.id);
            //This is handle by current connected client 
            client.emit('messages',{hello:'world'});

            ping.promise.probe(host, {
                timeout: 10,
                extra: ['-i', '2'],
            }).then(function (res) {
                io.sockets.emit("data", res)
            });

            client.on("disconnect",function(){
                console.log("client disconnected",client.id);
            })
        
        })
    }
} 


const single = new Single('127.0.0.1');

// single.newConn()




// io.on('connection', function(socket){
//     console.log('conn', socket);
//     socket.on('ping1', function(id, msg){
//         console.log(id);
//         setTimeout(() => socket.broadcast.emit('Jamie joined', res), 1000*t);
//         // socket.emit('Jamie joined', res);
//     });
// });

// io.on('connection', s => {
//     console.error('socket.io connection');
//     for (var t = 0; t < 3; t++)
//       setTimeout(() => s.emit('message', 'message from server'), 1000*t);
//   });







app.use(express.static(__dirname + '/public'));

http.listen(8080, () => {
  console.log('listening on *:8080');
});
