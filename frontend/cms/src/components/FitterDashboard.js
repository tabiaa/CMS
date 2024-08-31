import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Logout from './Logout';
import axios from 'axios';

const FitterDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchAssignedComplaints = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/assignedComplaints?username=${username}`);
                setComplaints(response.data);
            } catch (error) {
                console.error('Error fetching complaints:', error);
            }
        };

        fetchAssignedComplaints();
    }, [username]);
    return (
        <div>
            <h1>Fitter Dashboard</h1>
            <Logout/>
            <table className="table table-bordered table-dark">
                <thead>
                    <tr>
                        <th scope="col">fa_id</th>
                        <th scope="col">account_id</th>
                        <th scope="col">book number</th>
                        <th scope="col">meter number</th>
                        <th scope="col">mtr_aging</th>
                        <th scope="col">disp_grp_cd</th>
                        <th scope="col">fa_type_cd</th>
                        <th scope="col">cust_name</th>
                        <th scope="col">fa_status</th>
                        <th scope="col">cms_status</th>
                        <th scope="col">assigned_to</th>
                        <th scope="col">last_updated</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map((complaint) => (
                        <tr key={complaint.fa_id}>
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
