import './index.scss';
import React from 'react';

import standardDeviation from '../../utils/deviation';

export default class Summary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            dataSet: null
        }
    }
    static getDerivedStateFromProps(props, current_state) {
        if (current_state.data !== props.data) {
            return {
                data: props.data,
                dataSet: props.dataSet
            }
        }
        return null;
    }
    render() {
        const dataSet = this.state.dataSet[0];
        const ping = this.state.data.ping ? this.state.data.ping : null;
        const max = Math.max.apply(Math, dataSet ? dataSet.data.map(o => o.y) : [0])
        const min = Math.min.apply(Math, dataSet ? [...dataSet.data].splice(1, 1).map(o => o.y) : [0]);
        return (
            <div className="card text-white bg-dark mb-3" style={{ maxWidth: '18rem' }}>
                <div className="card-header">{ this.state.data.host }</div>
                <div className="card-body">
                    <p>Current: { ping ? ping.time : null } </p>
                    <p>Mean: { dataSet ? (dataSet.data.reduce((a, b) => { return {y: a.y + b.y} }).y / dataSet.data.length).toFixed(3) : null } </p>
                    <p>Max: { max }</p>
                    <p>Min: { min }</p>
                    <p>{dataSet ? (standardDeviation(dataSet ? dataSet.data.map(o => o.y) : [0]) / (dataSet.data.reduce((a, b) => { return {y: a.y + b.y} }).y / dataSet.data.length).toFixed(3) * 100).toFixed(1) : null }% deviation at { standardDeviation(dataSet ? dataSet.data.map(o => o.y) : [0]).toFixed(2)}ms</p>
                </div>
            </div>
        );
    }
}


