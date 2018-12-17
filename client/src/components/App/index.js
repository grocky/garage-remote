import React, { Component } from 'react';
import logo from './logo-red.svg';
import socketIOClient from 'socket.io-client'

import './style.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      status: '',
      inFlight: false,
      clicks: 0
    };
    this.toggleGarageButton = this.toggleGarageButton.bind(this)
  }

  componentDidMount() {
    const socket = socketIOClient();
    socket.on('garage/state', data => this.setState({ status: data }));
  }

  toggleGarageButton = () => {
    this.setState(prev => Object.assign(prev, {
      inFlight: true,
      clicks: ++prev.clicks
    }));

    return fetch('/garage')
  };

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Garage door opener!</h1>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-md-4 offset-md-4">
                <button className='btn btn-block' onClick={this.toggleGarageButton}>Click Me</button>
            </div>
          </div>
        </div>
        <section>
          Current status: {this.state.status}
        </section>
      </div>
    );
  }
}

export default App;
