import './index.scss';
import React from 'react';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    console.log('Header extends React.Component: ', props);
  }
  render() {
    return (
      <header className="container">
          <nav className="navbar navbar-expand-lg">
              <a className="navbar-brand" href="#">Ping Socks &nbsp;<span className="lead">Graph your latency..</span></a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                  <ul className="navbar-nav ml-auto">
                      {/* <li className="nav-item active">
                      <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                      </li>
                      <li className="nav-item">
                      <a className="nav-link" href="#">Features</a>
                      </li>
                      <li className="nav-item">
                      <a className="nav-link" href="#">Pricing</a>
                      </li>
                      <li className="nav-item">
                      <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Disabled</a>
                      </li> */}
                  </ul>
              </div>
          </nav>
      </header>
    );
  }
}