import { Alert, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import NavBar from './Components/NavBar';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import Billing from './Pages/Billing';
import Vets from './Pages/Vets';
import Medications from './Pages/Medications';
import './Styles/App.css';

// Custom theme for buttons
const theme = createTheme({
  palette: {
    primary: {
      main: '#005035', // Custom color for primary buttons
    },
    secondary: {
      main: '#005035', // Custom color for secondary buttons
    }
  },
});

// Component to protect routes from unauthenticated users
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return isAuthenticated ? children : <Navigate to="/login" />; // If authenticated, allow access, otherwise redirect to login
}

function App() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  // Function to trigger login success message and store authentication state
  const handleLoginSuccess = () => {
    setLoginSuccess(true);
    localStorage.setItem("isAuthenticated", "true"); // Set user as authenticated in localStorage
    setTimeout(() => {
      setLoginSuccess(false);
    }, 3000); // Hide after 3 seconds
    navigate("/home"); // Redirect to home page after login
  };

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      {loginSuccess && (
        <Alert 
          severity="success" 
          sx={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            zIndex: 10, 
            minWidth: '300px',
            padding: 2
          }}>
          Login successful!
        </Alert>
      )}
      <Routes>
        {/* Default route (/) goes to the login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Login page */}
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        
        {/* Register page */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Protect homepage content */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

        {/* Billing page*/}
        <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />

        {/* Vets page*/}
        <Route path="/vets" element={<ProtectedRoute><Vets /></ProtectedRoute>} />

        {/* Medications page*/}
        <Route path="/medications" element={<ProtectedRoute><Medications /></ProtectedRoute>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;