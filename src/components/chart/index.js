import React from 'react';
// import './index.scss';
import moment from 'moment';
import  Chart from 'chart.js';
import 'chartjs-plugin-streaming';
import io from 'socket.io-client';

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

function randomScalingFactor() {
	return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
}



export default class LineChart extends React.Component {
  constructor(props) {
    super(props);
  }
  static getDerivedStateFromProps(props, current_state) {
    if (current_state.value !== props.value) {
      return {
        value: props.value,
        computed_prop: heavy_computation(props.value)
      }
    }
    return null
  }
  componentDidMount(){
    console.log('componentDidMount', this.props.data);

    const socket = io.connect();
    socket.on("data",function(data){
      const messages = document.getElementById('messages');
      console.log(data)
      // this.props.data ={
      //   time: data.time != null ? data.time : null
      // }
      // $('#messages').append(`<ul>${data.host.toString()}</ul>`);
    })


    var color = Chart.helpers.color;
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
        }, {
          label: 'Dataset 3 (cubic interpolation)',
          backgroundColor: color(chartColors.green).alpha(0.5).rgbString(),
          borderColor: chartColors.green,
          fill: false,
          cubicInterpolationMode: 'monotone',
          data: this.props.data != null ? this.props.data.time : []
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Ping Times'
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

    function onRefresh(chart) {
      chart.config.data.datasets.forEach(function(dataset) {
        dataset.data.push({
          x: Date.now(),
          y: randomScalingFactor()
        });
      });
    }




    var ctx = document.getElementById(this.props.id).getContext('2d');
    window.myChart = new Chart(ctx, config);

    document.getElementById('addDataset').addEventListener('click', function() {
      var colorName = colorNames[config.data.datasets.length % colorNames.length];
      var newColor = chartColors[colorName];
      var newDataset = {
        label: 'Dataset ' + (config.data.datasets.length + 1),
        
        backgroundColor: color(newColor).alpha(0.5).rgbString(),
        borderColor: newColor,
        fill: false,
        lineTension: 0,
        data: []
      };
      config.data.datasets.push(newDataset);
      window.myChart.update();
    });
    
    document.getElementById('removeDataset').addEventListener('click', function() {
      config.data.datasets.pop();
      window.myChart.update();
    });
    
    document.getElementById('addData').addEventListener('click', function() {
      onRefresh(window.myChart);
      window.myChart.update();
    });

    document.getElementById('randomizeData').addEventListener('click', function() {
      config.data.datasets.forEach(function(dataset) {
        dataset.data.forEach(function(dataObj) {
          dataObj.y = randomScalingFactor();
        });
      });
      window.myChart.update();
    });
    
    
  }
  render() {
    return (
      <div>
        <canvas id={this.props.id}></canvas>
        <p className="text-center">
          <button type="button" className="btn btn-outline-primary btn-sm" id="randomizeData">Randomize Data</button>
          <button type="button" className="btn btn-outline-primary btn-sm" id="addDataset">Add Dataset</button>
          <button type="button" className="btn btn-outline-primary btn-sm" id="removeDataset">Remove Dataset</button>
          <button type="button" className="btn btn-outline-primary btn-sm" id="addData">Add Data</button>
        </p>
      </div>
    );
  }
}
