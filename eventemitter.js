// import { EventEmitter } from 'events';
const events = require('events');
const eventEmitter = new events.EventEmitter();

eventEmitter.on('myEvent', () => {
    console.log('Listener 1');
});

eventEmitter.emit('myEvent');

eventEmitter.on("myEvent", () => {
    console.log("Listener 2");
});