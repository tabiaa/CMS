import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navigation.css'; 
import logo from '../images/logo.png';

function Navigation() {
  return (
    <div className='background-container mt-0'>
      <div className='content' style={{marginTop:0}}>
      {/* <img src={logo} className='img-fluid mt-0' alt="Logo" style={{ maxWidth: '350px', height: 'auto' }}/> */}
      <h1 className='heading font-weight-bold'>Complaint Management System</h1>
        <Link to="/supervisor-login" className='btn btn-primary mr-3 btn-lg'>Login as a supervisor</Link>
        <Link to="/fitter-login" className='btn btn-danger ml-3 btn-lg'>Login as a fitter</Link>
    </div>
    </div>
  );
}

export default Navigation;
