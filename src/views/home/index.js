import './index.scss';
import React from 'react';
import io from 'socket.io-client';
import $ from 'jquery';

import LineChart from '../../components/chart'

const socket = io.connect();

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log('Home extends React.Component: ', props);
  }
  componentDidMount(){
    const that = this;
    socket.on("data",function(data){
      that.setState({'data': data});
    })
  }
  render() {
    return (
        <div className="container">
          <LineChart id="ping1"  data={ this.state != null ? this.state.data : null  }></LineChart>
          <ul id="messages"></ul>
        </div>
    );
  }
}