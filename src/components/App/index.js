import React, { Component } from 'react';
import logo from './logo.svg';
import './style.css';

class App extends Component {
  state = { users: []}

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(body => body.data)
      .then(users => this.setState({ users }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.name}</div>
        )}
      </div>
    );
  }
}

export default App;
