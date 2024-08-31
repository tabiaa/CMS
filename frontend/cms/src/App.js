import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SupervisorLogin from './components/SupervisorLogin';
import FitterLogin from './components/FitterLogin';
import SupervisorDashboard from './components/SupervisorDashboard';
import FitterDashboard from './components/FitterDashboard';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import Signup from './components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
        <Route path="/" element={ <Navigation />} />
          <Route path="/supervisor-login" element={<SupervisorLogin />} />
          <Route path="/fitter-login" element={<FitterLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/supervisor-dashboard"
            element={
              <PrivateRoute role="supervisor">
                <SupervisorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/fitter-dashboard"
            element={
              <PrivateRoute role="fitter">
                <FitterDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
