import './index.scss';
import React from 'react';

export default class Summary extends React.Component {
    constructor(props) {
        super(props);
        console.log('Summary extends React.Component: ', props);
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
        const data = this.state.data;
        const ping = this.state.data.ping ? this.state.data.ping : null;
        const dataSet = this.state.dataSet[0];
        console.log(this.state.data);
        console.log(this.state.dataSet[0]);
        return (
            <div className="card text-white bg-dark mb-3" style={{ maxWidth: '18rem' }}>
                <div className="card-header">{ this.state.data.host }</div>
                <div className="card-body">
                    <p>Current: { ping ? ping.time : null } </p>
                    <p>Mean: { dataSet ? (dataSet.data.reduce((a, b) => { return {y: a.y + b.y} }).y / dataSet.data.length).toFixed(3) : null } </p>
                    <p>Max: {Math.max.apply(Math, dataSet ? dataSet.data.map(o => o.y) : [0]) }</p>
                    <p>Min: {Math.min.apply(Math, dataSet ? dataSet.data.map(o => o.y) : [0]) }</p>
                </div>
            </div>
        );
    }
}


