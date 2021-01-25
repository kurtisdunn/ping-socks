import './index.scss';
import React from 'react';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    console.log('Footer extends React.Component: ', props);
  }
  render() {
    return (
      <footer className="container">
        Copyright
      </footer>
    );
  }
}