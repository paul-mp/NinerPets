import React from 'react';
import NavBar from './Components/NavBar.js';
import './Styles/App.css';

function App() {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <NavBar />
      <div
        className="app-background"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          height: 'calc(100vh - 64px)', 
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{ color: '#fff', fontSize: '3rem', margin: '20px 0' }}>Welcome to NinerPets</h1>
        <p style={{ color: '#fff', fontSize: '1.5rem' }}>The one shop tool for all pet needs for UNC Charlotte students!</p>
      </div>
    </div>
  );
}

export default App;
