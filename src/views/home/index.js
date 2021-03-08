import './index.scss';
import React from 'react';
import io from 'socket.io-client';
import $ from 'jquery';
 
import PingPost from '../../api/ping/post';
import PingDelete from '../../api/ping/delete'

import Button from '../../components/button';
import Input from '../../components/input';
import LineChart from '../../components/chart/lineChart'
import Summary from '../../components/summary';

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

let elem; 

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log('Home extends React.Component: ', props);
    this.line = React.createRef();
    this.state = {
      data: [],
      dataSets: [],
      selectedInterval: null
    };
    elem = this;
    this.socket = io.connect();

  }
  addPing(i, that){
      const socket = that.socket;
      const input = $('#hostsInput').val();
      const interval = this.state.selectedInterval;
      var colorName = colorNames[that.state.data.length % colorNames.length];
      var newColor = chartColors[colorName];
      let result;
      PingPost({
        host: input,
        interval: interval
      }).then((res) => {
          result = res;
          that.setState({ data: [...that.state.data, {
              host: res.hosts.host,
              id: res.id,
              color: newColor
          }] });
          socket.on(input ,function(i){
              const dat = Object.assign({}, that.state.data.filter(r => r.id === res.id)[0], { ping: i });
              that.setState({
                  data: that.state.data.map(r => (r.id === res.id ? Object.assign({}, dat) : r))
              });
          });
          that.line.current.addDataSet(result, that, newColor);
      });
  }
  removePing(i, that){
      var label = i.target.innerHTML;
      const labelTrimmed = label.replace(/ ×+$/, "").trim();
      PingDelete(i.target.id).then(r => {
          that.setState({ data : that.state.data.filter(r => r.id != i.target.id), dataSets: that.state.dataSets.filter(r => r.label != labelTrimmed.replace(/ ×+$/, ""))  });
      });
  }
  addDataSet(newDataset){
    elem.setState({ dataSets: [...elem.state.dataSets, newDataset] });
  }
  removeDataSet(i, that){
    console.log('REMOVE.add');
    const label = i.target.innerHTML;
    const labelTrimmed = label.replace(/ ×+$/, "").trim();
    PingDelete(i.target.id).then(r => {
        that.setState({ data : that.state.data.filter(r => r.id != i.target.id), dataSets: that.state.dataSets.filter(r => r.label != labelTrimmed.replace(/ ×+$/, ""))  });
    });
  }
  componentDidMount(){
      const that = this;
      this.socket.on('disconnect', function(){
          that.setState({ data: [], dataSets: [] })
      });
  }
  render() {
    const that = this;
    const data = this.state.data;
    return (
        <div className="container">
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <div className="input-group" >
            <Input class="transparent-input" title="Enter the target" aria-label="Hosts" aria-describedby="new" id="hostsInput" />  
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">interval</button>
            <ul className="dropdown-menu dropdown-menu-end" id="interval">
              { [1,2,5,10,30].map((i, k) =>  <li  key={k} ><a className="dropdown-item" href="#" value={i.toString() } onClick={ (r) => that.setState({selectedInterval: i.toString() })} >{i.toString()} sec</a></li>) }
            </ul>
            <Button class="btn-outline-secondary" type="button" title="Start" id="new" onClick={ (i) => that.addPing(i, that) }></Button>
        </div>
            
          </div>
          <div id="badges">
            {
              data.length > 0 ? (data[0].color ? data.map((i, k) => <div className="badge rounded-pill" style={{ background: i.color ? i.color : ''  }} key={k} > { i.host } - {`${i.ping ? i.ping.interval + 's' : ''}`} <span  id={i.id} onClick={ (i) => that.removePing(i, that) }> &nbsp; &times;</span></div> ) : '' ) : ''
            }
          </div>
          <br />
          <LineChart data={ this.state.data } dataSets={ this.state.dataSets } ref={ this.line } setData={ this.addDataSet } />
          <br /> 
          {
            data.length > 0 ? data.map((i, k) => <Summary data={i} dataSet={this.state.dataSets.filter(r => r.label === i.host)} key={k}/>) : null
          }
        </div>
    );
  }
}