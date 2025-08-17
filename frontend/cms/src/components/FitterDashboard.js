import React, { useState, useEffect } from 'react';
import Logout from './Logout';
import axios from 'axios';
import ssgc from '../images/logo.png';
import '../css/dashboard.css';
import ticket from '../images/ticket_logo.png';

const FitterDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [complaintStats, setComplaintStats] = useState({
    total: 0,
    complete: 0,
    pending: 0,
  });
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchComplaints();
  }, [username]);

  const fetchComplaints = async (status = '') => {
    try {
      const response = await axios.get(
        `http://localhost:5000/assignedComplaints?username=${username}${status ? `&status=${status}` : ''}`
      );
      setComplaints(response.data);
      setFilteredComplaints(response.data);

      // stats
      const complete = response.data.filter(c => c.cms_status === 'complete').length;
      const pending = response.data.filter(c => c.cms_status !== 'complete').length;
      setComplaintStats({
        total: response.data.length,
        complete,
        pending
      });
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleFilter = (status) => {
    fetchComplaints(status);
  };

  const markComplete = async (fa_id) => {
    try {
      await axios.put(`http://localhost:5000/complaints/complete/${fa_id}`);
      fetchComplaints(); // refresh after update
    } catch (error) {
      console.error('Error completing complaint:', error);
    }
  };

  return (
    <div>
      {/* header */}
      <header className="d-none d-lg-block">
        <nav className="navv">
          <div className='row'>
            <div className='col-11'>
              {/* <a href="#"><img src={ssgc} height="80px" style={{ paddingBottom: 3 }} /></a> */}
              <a href="#" className='text-background'>Complaint Management System - Fitter</a>
            </div>
            <div className='col-1'>
              <Logout />
            </div>
          </div>
        </nav>
      </header>

      {/* stats */}
      <div className='dashboard'>
        <div className='btn btn-danger tickets' onClick={() => handleFilter('')}>
          <h6>Total Tickets</h6>
          <div style={{ display: 'flex' }}>
            <img src={ticket} height={70} width={80} />
            <p className='p-4'>{complaintStats.total}</p>
          </div>
        </div>

        <div className='btn btn-success tickets' onClick={() => handleFilter('complete')}>
          <h6>Completed</h6>
          <div style={{ display: 'flex' }}>
            <img src={ticket} height={70} width={80} />
            <p className='p-4'>{complaintStats.complete}</p>
          </div>
        </div>

        <div className='btn btn-warning tickets' onClick={() => handleFilter('pending')}>
          <h6>Pending</h6>
          <div style={{ display: 'flex' }}>
            <img src={ticket} height={70} width={80} />
            <p className='p-4'>{complaintStats.pending}</p>
          </div>
        </div>
      </div>

      {/* complaints table */}
      <table className='table table-bordered table-bordered-bold' style={{ borderRadius: 22, overflow: 'hidden' }}>
        <thead className='table-header'>
          <tr>
            <th>Action</th>
            <th>fa_id</th>
            <th>account_id</th>
            <th>book number</th>
            <th>meter number</th>
            <th>mtr_aging</th>
            <th>disp_grp_cd</th>
            <th>fa_type_cd</th>
            <th>cust_name</th>
            <th>fa_status</th>
            <th>cms_status</th>
            <th>assigned_to</th>
            <th>last_updated</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.map((complaint) => (
            <tr key={complaint.fa_id}>
              <td>
                {complaint.cms_status !== 'complete' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => markComplete(complaint.fa_id)}
                  >
                    Complete
                  </button>
                )}
              </td>
              <td>{complaint.fa_id}</td>
              <td>{complaint.account_id}</td>
              <td>{complaint.book_nbr}</td>
              <td>{complaint.mtr_nbr}</td>
              <td>{complaint.mtr_aging}</td>
              <td>{complaint.disp_grp_cd}</td>
              <td>{complaint.fa_type_cd}</td>
              <td>{complaint.cust_name}</td>
              <td>{complaint.fa_status}</td>
              <td>{complaint.cms_status}</td>
              <td>{complaint.assigned_to}</td>
              <td>{complaint.last_updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FitterDashboard;
