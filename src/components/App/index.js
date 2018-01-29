import React, { Component } from 'react';
import logo from './logo.svg';
import Users from '../Users';

import './style.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      users: []
    }
    this.toggleGarageButton = this.toggleGarageButton.bind(this)
  }

  toggleGarageButton() {
    fetch('/garage')
      .then(res => res.json())
      .then(body => body.data)
      .then(users => this.setState({ users }));
  }

  render() {
    console.log(this.state);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <button onClick={this.toggleGarageButton}>Click Me</button>
        <Users users={this.state.users}></Users>
      </div>
    );
  }
}

export default App;
