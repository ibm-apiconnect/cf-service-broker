import React, { Component } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import logo from '../images/API-Connect-logo.png';

class NavWrapper extends Component {
  render() {
    return (
      <Jumbotron className='App-header'>
        <img className='App-logo' src={logo} />
        <p>This is a sample CF Service Broker. It is designed to discover your API Connect artifacts and bind them to a CF application.</p>
      </Jumbotron>
    );
  }
}

export default NavWrapper;
