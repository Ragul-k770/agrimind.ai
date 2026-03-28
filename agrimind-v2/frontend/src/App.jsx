import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Eagerly loaded for performance
import Welcome from './pages/Welcome.jsx';

// Lazy loaded for low internet optimization per M-requirements
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));

// Loading screen with premium UI
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="px-6 py-4 glass-card flex items-center space-x-3 text-agrimind-500 animate-pulse">
      <div className="w-5 h-5 rounded-full border-t-2 border-agrimind-500 animate-spin"></div>
      <span className="font-poppins font-medium">Loading AgriMind...</span>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
