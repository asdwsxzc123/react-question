import React from 'react';
import logo from './logo.svg';
import './App.css';
import { loginByPasswordService, logoutService } from './service/auth';
import TokenManager from './core/tokenManager';

function App() {
  function login() {
    loginByPasswordService({
      account: '1',
      password: '1',
    });
  }
  function logout() {
    logoutService()
  }
  function refresh() {
    TokenManager.refreshNewToken()
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={login}>login</button>
        <button onClick={logout}>logout</button>
        <button onClick={refresh}>refresh</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
