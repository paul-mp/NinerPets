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
import Appointments from './Pages/Appointments';
import Calendar from './Pages/calendar';
import ManagePets from './Pages/ManagePets';
import Profile from './Pages/Profile';
import MedicalRecords from './Pages/MedicalRecords'
import './Styles/App.css';
import { jwtDecode } from 'jwt-decode';
import FAQ from './Pages/Faq';
import NearbyVets from './Pages/NearbyVets';

const theme = createTheme({
  palette: {
    primary: {
      main: '#005035', 
    },
    secondary: {
      main: '#005035', 
    }
  },
});

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const isValidToken = (token) => {
    if (!token) return false; 

    try {
      const decoded = jwtDecode(token); 
      if (!decoded || Date.now() >= decoded.exp * 1000) {
        return false; 
      }
      return true; 
    } catch (error) {
      return false; 
    }
  };

  // Check if user is authenticated and if the token is valid
  if (!isAuthenticated || !isValidToken(token)) {
    return <Navigate to="/login" />; // If not authenticated or invalid token, redirect to login
  }

  return children; // Allow access to protected route if valid
}

function App() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  // Function to trigger login success message and store authentication state
  const handleLoginSuccess = (token) => {
    setLoginSuccess(true);
    localStorage.setItem("authToken", token);  // Store the token in localStorage
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

        {/* Appointments page*/}
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />

        {/* Calendar page*/}
        <Route path="/Calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        {/* Appointments page*/}
        <Route path="/manage-pets" element={<ProtectedRoute><ManagePets /></ProtectedRoute>} />

        {/* Profile page*/}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* MedicalRecords*/}
        <Route path="/medicalrecords" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
        
        {/* FAQ page*/}
        <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />

        {/* Nearby Vets page*/}
        <Route path="/nearbyvets" element={<ProtectedRoute><NearbyVets /></ProtectedRoute>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
