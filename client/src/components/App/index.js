import React, { Component } from 'react';
import logo from './logo-red.svg';

import './style.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      status: '',
      inFlight: false,
      clicks: 0
    }
    this.toggleGarageButton = this.toggleGarageButton.bind(this)
  }

  toggleGarageButton() {
    this.setState(prev => Object.assign(prev, {
      inFlight: true,
      clicks: ++prev.clicks
    }));

    fetch('/garage')
      .then(res => res.json())
      .then(body => body.data)
      .then(data => {
        return this.setState(prev => Object.assign(prev, {
          inFlight: false,
          status: data.message
        }))
      });
  }

  render() {

    const status = this.state.clicks 
      ? (<div>{this.state.status}</div>)
      : '';

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <button onClick={this.toggleGarageButton}>Click Me</button>
        {status}
      </div>
    );
  }
}

export default App;
