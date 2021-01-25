import './index.scss';
import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    console.log('Layout extends React.Component: ', props);
  }
  render() {
    return (
      <div id="container">
        <Header />
       { this.props.children }
       <Footer />
      </div>
    );
  }
}