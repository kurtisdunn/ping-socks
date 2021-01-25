const express = require('express');
const app = express();
const http = require('http').Server(app);
const Single = require('./utils/singleHost')
const io = require('socket.io')(http);
const path = require('path');

//TODO figure out a better way to pass IO to classes. 
const single = new Single(io, 'google.com');
// single.ping();

require('./routes')(app);

app.use(express.static(__dirname + '/dist'));

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/dist/index.html');
// });

http.listen(8080, () => {
  console.log('listening on *:8080');
});




