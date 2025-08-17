import React, { useState, useEffect } from 'react';
import EditComplaintForm from './EditComplaintForm';
import Logout from './Logout';
import axios from 'axios';
import ssgc from '../images/logo.png';
import '../css/dashboard.css';
import ticket from '../images/ticket_logo.png';
import {Refresh} from 'react-refresh';

const SupervisorDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [filterAging, setFilterAging] = useState(''); 
    const [filterDispGrpCd, setFilterDispGrpCd] = useState(''); 
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [complaintStats, setComplaintStats] = useState({
        total: 0,
        start: 0,
        pending: 0,
        complete: 0,
        hold: 0,
        canceled: 0,
    });

    
    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchComplaintStats();
        fetchComplaints();
    }, [username]);

    const fetchComplaintStats = async () => {
        try {
            const totalResponse = await axios.get(`http://localhost:5000/complaints?username=${username}`);
            const total = totalResponse.data.length;

            const startResponse = await axios.get(`http://localhost:5000/complaints?username=${username}&status=startpending`);
            const pendingResponse = await axios.get(`http://localhost:5000/complaints?username=${username}&status=pending`);
            const completeResponse = await axios.get(`http://localhost:5000/complaints?username=${username}&status=complete`);
            const holdResponse = await axios.get(`http://localhost:5000/complaints?username=${username}&status=hold`);
            const canceledResponse = await axios.get(`http://localhost:5000/complaints?username=${username}&status=cancel`);

            setComplaintStats({
                total,
                start: startResponse.data.length,
                pending: pendingResponse.data.length,
                complete: completeResponse.data.length,
                hold: holdResponse.data.length,
                canceled: canceledResponse.data.length,
            });
        } catch (error) {
            console.error('Error fetching complaint stats:', error);
        }
    };

    const fetchComplaints = async (status = '') => {
        try {
            console.log(`Fetching complaints with status: ${status}`);
            const response = await axios.get(`http://localhost:5000/complaints?username=${username}${status ? `&status=${status}` : ''}`);
            console.log('Fetched complaints:', response.data);
            setComplaints(response.data);
            setFilteredComplaints(response.data); 
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };
    

    const handleFilter = (status) => {
        fetchComplaints(status);
    };
    const handleEdit = (complaint) => {
        setEditingComplaint(complaint);
    };

    const closeEditForm = () => {
        setEditingComplaint(null);
    };

   const agingOptions = [...new Set(complaints.map((complaint) => complaint.mtr_aging))];
    const dispGrpCdOptions = [...new Set(complaints.map((complaint) => complaint.disp_grp_cd))];

    const handleFilter2 = () => {
        const filtered = complaints.filter((complaint) => {
            const matchesAging = filterAging ? complaint.mtr_aging.toString() === filterAging : true;
            const matchesDispGrpCd = filterDispGrpCd ? complaint.disp_grp_cd === filterDispGrpCd : true;
            return matchesAging && matchesDispGrpCd;
        });
        setFilteredComplaints(filtered);
    };

    return (

        <div>
            <header className="d-none d-lg-block">
                <nav className="navv">
                    <div>
                        <div className='row'>
                            <div className='col-11'>
                                {/* <a href="#"> <img src={ssgc} height="80px" style={{ paddingBottom: 3 }} /></a> */}
                                <a href="#" className='text-background'>Complaint Management System</a>
                            </div>
                            <div className='col-1'>
                                <Logout />
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <div className='dashboard'>
                <div className='btn btn-danger tickets' onClick={() => handleFilter('')}>
                    <h6>Total Tickets</h6>
                    <div style={{ display: 'flex' }}>
                        <img src={ticket} height={70} width={80} />
                        <p className='p-4'>{complaintStats.total}</p>
                    </div>
                </div>

                <div className='btn btn-danger rounded-border tickets' style={{ backgroundColor: '#339494' }} onClick={() => handleFilter('start')}>
                    <h6>start Tickets</h6>
                    <div style={{ display: 'flex' }}>
                        <img src={ticket} height={70} width={80} />
                        <p className='p-4'>{complaintStats.start}</p>
                    </div>
                </div>

                <div className='btn btn-danger tickets' style={{ backgroundColor: '#C67C48' }} onClick={() => handleFilter('pending')}>
                    <h6>pending</h6>
                    <div style={{ display: 'flex' }}>
                        <img src={ticket} height={70} width={80} />
                        <p className='p-4'>{complaintStats.pending}</p>
                    </div>
                </div>

                <div className='btn btn-danger tickets' style={{ backgroundColor: '#DAA520' }} onClick={() => handleFilter('complete')}>
                    <h4>complete</h4>
                    <div style={{ display: 'flex' }}>
                        <img src={ticket} height={70} width={80} />
                        <p className='p-4'>{complaintStats.complete}</p>
                    </div>
                </div>

                <div className='btn btn-danger tickets' style={{ backgroundColor: '#8FBC8F' }} onClick={() => handleFilter('hold')}>
                    <h6>hold</h6>
                    <div style={{ display: 'flex' }}>
                        <img src={ticket} height={70} width={80} />
                        <p className='p-4'>{complaintStats.hold}</p>
                    </div>
                </div>

                <div className='btn btn-danger tickets' style={{ backgroundColor: '#866754' }} onClick={() => handleFilter('cancel')}>
                    <h6>Canceled</h6>
                    <div style={{ display: 'flex' }}>
                        <img src={ticket} height={70} width={80} />
                        <p className='p-4'>{complaintStats.canceled}</p>
                    </div>
                </div>
            </div>

            

            <div className='float-right'>
            

            <div className="dropdown">
                <select className='btn btn-danger m-3'
                    value={filterAging}
                    onChange={(e) => setFilterAging(e.target.value)}
                >
                    <option value="">Filter by Aging</option>
                    {agingOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <select className='btn btn-danger m-3' 
                    value={filterDispGrpCd}
                    onChange={(e) => setFilterDispGrpCd(e.target.value)}
                >
                    <option value="">Filter by Dispatch Group Code</option>
                    {dispGrpCdOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <button onClick={handleFilter2} className='btn btn-success'>Filter</button>
            </div>
            </div>
            
            {/* Complaints Table */}
            <table className='table table-bordered table-bordered-bold' style={{ borderRadius: 22, overflow: 'hidden' }}>
                <thead className='table-header'>
                    <tr>
                        <th scope="col">Action</th>
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
                    {filteredComplaints.map((complaint) => (
                        <tr key={complaint.fa_id}>
                            <td>
                                <button className='btn btn-danger' onClick={() => handleEdit(complaint)}>Edit</button>
                            </td>
                            <td>{complaint.fa_id}</td>
                            <td>{complaint.account_id}</td>
                            <td>{complaint.book_nbr}</td>
                            <td>{complaint.mtr_nbr}</td>
                            <td>{complaint.mtr_aging}</td>
                            <td>{complaint.disp_grp_cd}</td>
                            <td>{complaint.fa_type_cd}</td>
                            <td className=''>{complaint.cust_name}</td>
                            <td className=''>{complaint.fa_status}</td>
                            <td className=''>{complaint.cms_status}</td>
                            <td className=''>{complaint.assigned_to}</td>
                            <td className=''>{complaint.last_updated}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingComplaint && (
                <EditComplaintForm complaint={editingComplaint} closeForm={closeEditForm} />
            )}
        </div>
    );
};

export default SupervisorDashboard;

   