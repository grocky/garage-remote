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
      .then(data =>
          this.setState(prev => Object.assign(prev, {
              inFlight: false,
              status: data.message
          }))
      );
  }

  render() {

    const status = this.state.clicks 
      ? (<div>{this.state.status}</div>)
      : '';

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
        {status}
      </div>
    );
  }
}

export default App;
