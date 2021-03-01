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
        console.log(this.state.dataSet);
        return (
            <div className="card text-white bg-dark mb-3" style={{maxWidth: '18rem'}}>
                <div className="card-header">Header</div>
                <div className="card-body">
                    <h5 className="card-title">Dark card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
        );
    }
}