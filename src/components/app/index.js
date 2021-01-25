import '../../scss/main.scss';
import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, IndexRoute, hashHistory } from 'react-router-dom';

import Cart from '../../views/cart';
import Contact from '../../views/contact';
import Home from '../../views/home';
import Layout from '../../views/layout';

console.log(document);

ReactDOM.render(
  <Router>
    <Layout>
        <Route path="/" render={ ()=> <Home /> } exact />
        <Route path="/cart" render={ ()=> <Cart /> } />
        <Route path="/contact" render={ ()=> <Contact /> } />
    </Layout>
  </Router>,
  document.getElementById('app')
);