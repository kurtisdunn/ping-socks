import './index.scss';
import React from 'react';

import DefaultChart from '../../components/chart'
import LineChart from '../../components/chart/lineChart'

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log('Home extends React.Component: ', props);
  }
  render() {
    return (
        <div className="container">
          <br />
          <LineChart id="ping2"></LineChart>
          <br />
          < hr />
          <br /> 
          {/* <DefaultChart id="ping1"></DefaultChart> */}

          <ul id="messages"></ul>
        </div>
    );
  }
}