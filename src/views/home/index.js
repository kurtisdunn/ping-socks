import './index.scss';
import React from 'react';
import io from 'socket.io-client';
import $ from 'jquery';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log('Home extends React.Component: ', props);
    const socket = io.connect();
    socket.on("messages",function(data){
      console.log("message is ",data);
      //alert(data)
      })
    socket.on("data",function(data){
      const messages = document.getElementById('messages');
      console.log(messages)
      $('#messages').append(`<ul>${data.host.toString()}</ul>`);
      console.log("data is ",data);
      //alert(data)
    })

    socket.on("particular User",function(data){
      console.log("data from server ",data);
      //alert(data)
    })
  }
  render() {
    return (
        <div className="container">
          <ul id="messages"></ul>
        </div>
    );
  }
}