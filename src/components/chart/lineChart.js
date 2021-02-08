import './index.scss';
import React from 'react';
import { Chart, Line } from 'react-chartjs-2';
import 'chartjs-plugin-streaming';
import io from 'socket.io-client';
import $ from 'jquery';

import PingPost from '../../api/ping/post';
import PingDelete from '../../api/ping/delete'

import Input from '../input';
import Button from '../button';

const chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

let colorNames = Object.keys(chartColors);
const color = Chart.helpers.color;

export default class LineChart extends React.Component {
    constructor(props) {
        super(props);
        console.log('LineChart extends React.Component: ', props);
        this.state = {
            data: [],
            dataSets: []
        };
        const socket = this.socket = io.connect();
    }
    componentDidMount(){
        const that = this;
        this.socket.on('disconnect', function(){
            that.setState({ data: [], dataSets: [] })
        });
    }
    addDataSet(res, that, newColor){
        const input = $('#hostsInput').val();
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
        that.setState({ dataSets: [...that.state.dataSets, newDataset] });
    }
    addPing(i, that){
        const socket = that.socket;
        const input = $('#hostsInput').val();
        var colorName = colorNames[that.state.data.length % colorNames.length];
        var newColor = chartColors[colorName];
        let result;
        PingPost(input).then((res) => {
            result = res;
            that.setState({ data: [...that.state.data, {
                host: res.hosts,
                id: res.id,
                color: newColor
            }] });
            socket.on(input ,function(i){
                const dat = Object.assign({}, that.state.data.filter(r => r.id === res.id)[0], { ping: i });
                that.setState({
                    data: that.state.data.map(r => (r.id === res.id ? Object.assign({}, dat) : r))
                })
            });
            that.addDataSet(result, that, newColor)
        });
    }
    removePing(i, that){
        var label = i.target.innerHTML;
        const labelTrimmed = label.replace(/ ×+$/, "").trim();
        PingDelete(i.target.id).then(r => {
            that.setState({ data : that.state.data.filter(r => r.id != i.target.id), dataSets: that.state.dataSets.filter(r => r.label != labelTrimmed.replace(/ ×+$/, ""))  });
        });
    }
    onRefresh(chart){
        chart.data.datasets.forEach(function(dataset) {
            dataset.data.push({
                x: Date.now(),
                y: Math.random()
            });
        });
    }
    render() {
        const that = this;
        const onRefresh = this.onRefresh;
        const data = this.state.data;
        const dataSets = this.state.dataSets;
        return ( 
            <div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Input type="text" class="transparent-input" title="Enter the target" aria-label="Hosts" aria-describedby="new" id="hostsInput" />
                    <Button class="btn-outline-secondary" type="button" title="Start" id="new" onClick={ (i) => that.addPing(i, that) }></Button>
                </div>
                <div id="badges">
                {
                data.length > 0 ? (data[0].color ? data.map((i, k) => <div className="badge rounded-pill" style={{ background: i.color ? i.color : ''  }} key={k} id={i.id} onClick={ (i) => that.removePing(i, that) }> {i.host } &times;</div> ) : '' ) : ''
                }
                </div>
                <Line
                    data = {{ datasets: dataSets }}
                    options = {{
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
                    }}
                />
            </div>
        );
    }
}



