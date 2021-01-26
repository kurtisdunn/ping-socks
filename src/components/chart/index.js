import React from 'react';
import './index.scss';
import moment from 'moment';
import  Chart from 'chart.js';
import 'chartjs-plugin-streaming';

// var ctx = document.getElementById('myChart').getContext('2d');

// var chart = new Chart(ctx, {



export default class LineChart extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    console.log('test');
    const ctx = document.getElementById(this.props.id).getContext('2d');
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          data: []
        }, {
          data: []
        }]
      },
      options: {
        scales: {
          xAxes: [{
            realtime: {
              onRefresh: function(chart) {
                chart.data.datasets.forEach(function(dataset) {
                  dataset.data.push({
                    x: Date.now(),
                    y: Math.random()
                  });
                });
              }
          }]
        }
      }
    });
  }
  render() {
    return (
        <canvas id={this.props.id}></canvas>
    );
  }
}
