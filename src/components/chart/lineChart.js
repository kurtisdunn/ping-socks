import './index.scss';
import React from 'react';
import { Chart, Line } from 'react-chartjs-2';
import 'chartjs-plugin-streaming';

const chartColors = {
	red: 'rgb(255, 99, 132)',
    blue: 'rgb(54, 162, 235)',
    green: 'rgb(75, 192, 192)',
	orange: 'rgb(255, 159, 64)',
    grey: 'rgb(201, 203, 207)',
	yellow: 'rgb(255, 205, 86)',
	purple: 'rgb(153, 102, 255)'

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
    }
    static getDerivedStateFromProps(props, current_state) {
        console.log(props)
        if (current_state.data !== props.data) {
          return [{
            data: props.data,
          }]
        }
        return null
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
    // addPing(i, that){
    //     const socket = that.socket;
    //     const input = $('#hostsInput').val();
    //     var colorName = colorNames[that.state.data.length % colorNames.length];
    //     var newColor = chartColors[colorName];
    //     let result;
    //     PingPost(input).then((res) => {
    //         result = res;
    //         that.setState({ data: [...that.state.data, {
    //             host: res.hosts,
    //             id: res.id,
    //             color: newColor
    //         }] });
    //         socket.on(input ,function(i){
    //             const dat = Object.assign({}, that.state.data.filter(r => r.id === res.id)[0], { ping: i });
    //             that.setState({
    //                 data: that.state.data.map(r => (r.id === res.id ? Object.assign({}, dat) : r))
    //             })
    //         });
    //         that.addDataSet(result, that, newColor)
    //     });
    // }
    // removePing(i, that){
    //     var label = i.target.innerHTML;
    //     const labelTrimmed = label.replace(/ ×+$/, "").trim();
    //     PingDelete(i.target.id).then(r => {
    //         that.setState({ data : that.state.data.filter(r => r.id != i.target.id), dataSets: that.state.dataSets.filter(r => r.label != labelTrimmed.replace(/ ×+$/, ""))  });
    //     });
    // }
    onRefresh(chart){
        chart.data.datasets.forEach(function(dataset) {
            dataset.data.push({
                x: Date.now(),
                y: Math.random()
            });
        });
    }
    render() {
        console.log(this.state);
        const that = this;
        const onRefresh = this.onRefresh;

        const dataSets = this.state.dataSets;
        return ( 
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
                                    duration: 200000,
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
        );
    }
}



