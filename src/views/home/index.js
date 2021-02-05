import './index.scss';
import React from 'react';

import LineChart from '../../components/chart'

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log('Home extends React.Component: ', props);
  }
  render() {
    return (
        <div className="container">
          <LineChart id="ping1"  data={ this.state != null ? this.state.data : null  }></LineChart>
          <ul id="messages"></ul>
        </div>
    );
  }
}