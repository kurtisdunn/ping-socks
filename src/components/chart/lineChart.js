import './index.scss';
import React from 'react';
import { Chart, Line } from 'react-chartjs-2';
import 'chartjs-plugin-streaming';
import $ from 'jquery';

let elem;

export default class LineChart extends React.Component {
    constructor(props) {
        super(props);
        console.log('LineChart extends React.Component: ', props);
        this.state = {
            data: []
        };
        var handleToUpdate  =   this.props.handleToUpdate
        elem = this;
    }
    static getDerivedStateFromProps(props, current_state) {
        // console.log('LineChart.getDerivedStateFromProps', props)
        if (current_state.data !== props.data) {
          return {
            data: props.data,
            dataSets: props.dataSets
          }
        }
        return null;
    }
    addDataSet(res, that, newColor){
        console.log('LineChart.addDataSet');
        const color = Chart.helpers.color;
        const input = $('#hostsInput').val();
        const newDataset = {
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
        this.props.setData(newDataset);
        // that.setState({ dataSets: [...that.state.dataSets, newDataset] });
        // console.log(that.state);
    }

    onRefresh(chart){
        // console.log('elem.state.data', elem ? elem.state.data : 'fuck off');
        chart.data.datasets.forEach(function(dataset) {
            dataset.data.push({
                x: Date.now(),
                y: elem.state.data.length > 0 ? (elem.state.data.filter(r => r.host === dataset.label)[0].ping ? elem.state.data.filter(r => r.host === dataset.label)[0].ping.time : null ) : null
            });
        });
    }
    render() {
        const dataSets = this.state.dataSets;
        const onRefresh = this.onRefresh;
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



