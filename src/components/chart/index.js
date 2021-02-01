import './index.scss';
import React from 'react';
import moment from 'moment';
import  Chart from 'chart.js';
import 'chartjs-plugin-streaming';
import io from 'socket.io-client';
import $ from 'jquery';
import PingPost from '../../api/ping/post'

import Input from '../input';
import Button from '../button';

//TODO Duntion to add create a data set
//TODO componentDidUnmount remove event listners.

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

export default class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }
  static getDerivedStateFromProps(props, current_state) {
    console.log(props)
    // if (current_state.data !== props.data) {
    //   return [{
    //     id: props.id,
    //     data: props.data
    //   }]
    // }
    return null
  }
  componentDidMount(){
    console.log('componentDidMount', this.state.data);
    const that = this;
    // const dataSet = (data) => {
    //   return Object.assign({}, {
    //     label: data.label,
    //     backgroundColor: color(chartColors.red).alpha(0.5).rgbString(),
    //     borderColor: chartColors.red,
    //     fill: false,
    //     lineTension: 0,
    //     borderDash: [8, 4],
    //     data: []
    //   })
    // }

    // console.log(dataSet());  

    function onRefresh(chart) {

      chart.config.data.datasets.forEach(function(dataset) {
        dataset.data.push({
          x: Date.now(),
          y: randomScalingFactor()
        });
      });
    }
    var config = {
      type: 'line',
      data: {
        datasets: [{
          label: 'Dataset 1 (linear interpolation)',
          backgroundColor: color(chartColors.red).alpha(0.5).rgbString(),
          borderColor: chartColors.red,
          fill: false,
          lineTension: 0,
          borderDash: [8, 4],
          data: []
        }, {
          label: 'Dataset 2 (cubic interpolation)',
          backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
          borderColor: chartColors.blue,
          fill: false,
          cubicInterpolationMode: 'monotone',
          data: []
        }]
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
              labelString: 'value'
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
    socket.on("data",function(data){
      // const messages = document.getElementById('messages');
      console.log('socket.on("data"', data)
      // that.props.data ={
      //   time: data.time != null ? data.time : null
      // }
      // $('#messages').append(`<ul>${data.host.toString()}</ul>`);
    });

    document.getElementById('new').addEventListener('click', function() {
      const input = $('#hostsInput').val();
      PingPost(input).then((res) => {
        // that.state.data.push(res);
        that.setState({ data: [...that.state.data, res] })
        // that.setState({'data': Object.assign({}, res)});
        console.log(that.state);
      });

    

      // var colorName = colorNames[config.data.datasets.length % colorNames.length];
      // var newColor = chartColors[colorName];
      // var newDataset = {
      //   label: 'Dataset ' + (config.data.datasets.length + 1),
        
      //   backgroundColor: color(newColor).alpha(0.5).rgbString(),
      //   borderColor: newColor,
      //   fill: false,
      //   lineTension: 0,
      //   data: []
      // };
      // config.data.datasets.push(newDataset);
      // window.myChart.update();
    });



    // document.getElementById('addDataset').addEventListener('click', function() {

    //   PingPost(hosts)
    //   // var colorName = colorNames[config.data.datasets.length % colorNames.length];
    //   // var newColor = chartColors[colorName];
    //   // var newDataset = {
    //   //   label: 'Dataset ' + (config.data.datasets.length + 1),
        
    //   //   backgroundColor: color(newColor).alpha(0.5).rgbString(),
    //   //   borderColor: newColor,
    //   //   fill: false,
    //   //   lineTension: 0,
    //   //   data: []
    //   // };
    //   // config.data.datasets.push(newDataset);
    //   // window.myChart.update();
    // });
    
    // document.getElementById('removeDataset').addEventListener('click', function() {
    //   config.data.datasets.pop();
    //   window.myChart.update();
    // });
    
    // document.getElementById('addData').addEventListener('click', function() {
    //   onRefresh(window.myChart);
    //   window.myChart.update();
    // });

    // document.getElementById('randomizeData').addEventListener('click', () => {
    //     config.data.datasets.forEach(function (dataset) {
    //       dataset.data.forEach(function (dataObj) {
    //         dataObj.y = randomScalingFactor();
    //       });
    //     });
    //     window.myChart.update();
    //   });
    
    
  }
  render() {
    const data = this.state.data;
    console.log('render', data.length > 0 ? data : null);

    return (
      <div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Input type="text" class="transparent-input" title="Hosts" aria-label="Hosts" aria-describedby="new" id="hostsInput" />
        <Button class="btn-outline-secondary" type="button" id="new">Button</Button>
      </div>
        <div id="badges">
        {
          data.length > 0  ? data.map((i, k) => 
            <div className="badge rounded-pill badge-red" key={k}>{i.ping.hosts } &nbsp;<span aria-hidden="true">&times;</span></div>
          ) : ''
        }
        </div>
        <canvas id={ this.props.id }></canvas>
        <p className="text-center">
          {/* <button type="button" className="btn btn-outline-primary btn-sm" id="randomizeData">Randomize Data</button>
          <button type="button" className="btn btn-outline-primary btn-sm" id="addDataset">Add Dataset</button>
          <button type="button" className="btn btn-outline-primary btn-sm" id="removeDataset">Remove Dataset</button>
          <button type="button" className="btn btn-outline-primary btn-sm" id="addData">Add Data</button> */}
        </p>
      </div>
    );
  }
}
