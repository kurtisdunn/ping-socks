import './index.scss';
import React from 'react';
import io from 'socket.io-client';
import $ from 'jquery';

import LineChart from '../../components/chart'

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log('Home extends React.Component: ', props);
    const socket = io.connect();
    socket.on("messages",function(data){
      console.log("message is ",data);
      })
    socket.on("data",function(data){
      const messages = document.getElementById('messages');
      $('#messages').append(`<ul>${data.host.toString()}</ul>`);
    })

    socket.on("particular User",function(data){
      console.log("data from server ",data);
    })
  }
  render() {
    return (
        <div className="container">
          <LineChart id="ping1"></LineChart>
          <ul id="messages"></ul>
        </div>
    );
  }
}