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

export default class DefaultChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }
 
  componentDidMount(){
    console.log('componentDidMount', this.state.data);
    const that = this;
    var colorNames = Object.keys(chartColors);
    var color = Chart.helpers.color;
    var colorName = colorNames[this.state.data.length % colorNames.length];
    var newColor = chartColors[colorName];

    function onRefresh(chart) {
      chart.config.data.datasets.forEach(function(dataset) {
        dataset.data.push({
          x: Date.now(),
          y: that.state.data[0].ping ? that.state.data.filter(r => r.hosts === dataset.label)[0].ping.time : null
        });
      });
    }
 
    var config = that.config = {
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
              duration: 50000,
              refresh: 1000,
              delay: 1000,
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

    socket.on('disconnect', function(){
      config.data.datasets = [];
      window.myChart.update();
      that.setState({ data: [] })
    })

    document.getElementById('new').addEventListener('click', function() {
      const input = $('#hostsInput').val();
      PingPost(input).then((res) => {
        that.setState({ data: [...that.state.data, res] });

        var colorName = colorNames[that.state.data.length % colorNames.length];
        var newColor = chartColors[colorName];
        const setcolour = Object.assign({}, that.state.data.filter(r => r.id === res.id)[0], { color: newColor });
       
        that.state.data[that.state.data.findIndex(el => el.id === res.id)] = setcolour;
        socket.on(input ,function(i){
          const dat = Object.assign({}, that.state.data.filter(r => r.id === res.id)[0], { ping: i });
          const newdata = that.state.data[that.state.data.findIndex(el => el.id === res.id)] = dat;
        });

        var newDataset = {
          label: input,
          backgroundColor: color(newColor).alpha(0.5).rgbString(),
          borderColor: newColor,
          fill: false,
          lineTension: 0,
          data: [{
            x: Date.now(),
            y: that.state.data.filter(r => r.id === res.id)[0].ping ? that.state.data.filter(r => r.id === res.id)[0].ping.time : null
          }]
        };
        console.log(newDataset);
        setTimeout(() => {
          config.data.datasets.push(newDataset);
          window.myChart.update();
          that.forceUpdate()
        }, 500);
      });
    });
  }+9
  remove(i, that){
    PingDelete(i.target.id).then(r => {
      const data = that.state.data.filter(r => r.id != i.target.id);
      that.setState({ data : data });
      that.config
    });
  }
  render() {
    const that = this;
    const data = this.state.data;
    const remove = this.remove;
    console.log(data);
    return (
      <div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Input type="text" class="transparent-input" title="Enter the target" aria-label="Hosts" aria-describedby="new" id="hostsInput" />
        <Button class="btn-outline-secondary" type="button" title="Start" id="new"></Button>
      </div>
        <div id="badges">
        {
          data.length > 0 ? (data[0].color ? data.map((i, k) => <div className="badge rounded-pill" style={{ background: i.color ? i.color : ''  }} key={k} id={i.id} onClick={ (i) => remove(i, that) }> {i.hosts } &nbsp;&times;</div> ) : '' ) : ''
        }
        </div>
        <canvas id={ this.props.id }></canvas>
      </div>
    );
  }
}
