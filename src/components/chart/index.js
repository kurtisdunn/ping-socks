import './index.scss';
import React from 'react';
import moment from 'moment';
import  Chart from 'chart.js';
import 'chartjs-plugin-streaming';
import io from 'socket.io-client';
import $ from 'jquery';

import PingPost from '../../api/ping/post';
import PingDelete from '../../api/ping/delete'

import Input from '../input';
import Button from '../button';

var chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

var colorNames = Object.keys(chartColors);
var color = Chart.helpers.color;

function randomScalingFactor() {
  return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
}
      // var colorName = colorNames[config.data.datasets.length % colorNames.length];
      // var newColor = chartColors[colorName];
export default class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }

  }
 
  componentDidMount(){
    console.log('componentDidMount', this.state.data);
    const that = this;
      var colorName = colorNames[this.state.data.length % colorNames.length];
      var newColor = chartColors[colorName];

    function onRefresh(chart) {
      chart.config.data.datasets.forEach(function(dataset) {
        dataset.data.push({
          x: Date.now(),
          y: that.state.data.length > 0 ? that.state.data[0].ping.time : null
        });
      });
    }
 
    var config = {
      type: 'line',
      data: {
        datasets: []
      },
      options: {
        legend: {
          display: false
        },
        title: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'realtime',
            realtime: {
              duration: 20000,
              refresh: 1000,
              delay: 2000,
              onRefresh: onRefresh
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time ms'
            }
          }]
        },
        tooltips: {
          mode: 'nearest',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: false
        }
      }
    };
    var ctx = document.getElementById(this.props.id).getContext('2d');
    window.myChart = new Chart(ctx, config);
    const socket = io.connect();

    let sock;
    socket.on('connect' ,function(data){
      data = sock;
      console.log("connect, Successfully connected!");
    });


    document.getElementById('new').addEventListener('click', function() {
    const input = $('#hostsInput').val();
    
    PingPost(input).then((res) => {
      that.setState({ data: [...that.state.data, res] });
      const data = that.state.data;
      // let dat = Object.assign(data.filter(r => r.id === res.id, {}, data) );
      socket.on(input ,function(i){
        const dat = Object.assign({}, that.state.data.filter(r => r.id === res.id)[0], { ping: i });
        const newdata = that.state.data[that.state.data.findIndex(el => el.id === res.id)] = dat;
      });
      console.log(that.state.data[0]);
      var colorName = colorNames[that.state.data.length % colorNames.length];
      var newColor = chartColors[colorName];
      var newDataset = {
        label: 'Dataset ' + (config.data.datasets.length + 1),
        backgroundColor: color(newColor).alpha(0.5).rgbString(),
        borderColor: newColor,
        fill: false,
        lineTension: 0,
        data: [{
          x: Date.now(),
          y: that.state.data.length > 0 ? that.state.data[0].ping.time : null
        }]
      };
      config.data.datasets.push(newDataset);
      window.myChart.update();
      // console.log(that.state);
    });
    });
    
    
  }
  remove(i, that){
    // const that = this;
    PingDelete(i.target.id).then(r => {
      console.log('r', r);
      // console.log('r', that.state);
      const data = that.state.data.filter(r => r.id != i.target.id);
      console.log(data);
      that.setState({ data : data });
      //function(el) { return el.Name != "Kristian"; }); 
    });
  }
  render() {
    const that = this;
    const data = this.state.data;
    const remove = this.remove;
    console.log('render', this.state);

    return (
      <div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Input type="text" class="transparent-input" title="Enter the target" aria-label="Hosts" aria-describedby="new" id="hostsInput" />
        <Button class="btn-outline-secondary" type="button" title="Start" id="new"></Button>
      </div>
        <div id="badges">
        {
          data.length > 0  ? data.map((i, k) => 
            <div className="badge rounded-pill badge-red" key={k} id={i.id} onClick={ (i) => remove(i, that) }> {i.hosts } &nbsp;&times;</div>
          ) : ''
        }
        </div>
        <canvas id={ this.props.id }></canvas>
      </div>
    );
  }
}
