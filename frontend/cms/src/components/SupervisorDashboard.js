import React, { useState, useEffect } from 'react';
import EditComplaintForm from './EditComplaintForm';
import Logout from './Logout';
import axios from 'axios';

const SupervisorDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [filterAging, setFilterAging] = useState(''); // State for aging filter
    const [filterDispGrpCd, setFilterDispGrpCd] = useState(''); // State for disp_grp_cd filter
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/complaints?username=${username}`);
                setComplaints(response.data);
                setFilteredComplaints(response.data); // Initialize filtered complaints
            } catch (error) {
                console.error('Error fetching complaints:', error);
            }
        };

        fetchComplaints();
    }, [username]);

    const handleEdit = (complaint) => {
        setEditingComplaint(complaint);
    };

    const closeEditForm = () => {
        setEditingComplaint(null);
    };

    // Get unique options for dropdown filters
    const agingOptions = [...new Set(complaints.map((complaint) => complaint.mtr_aging))];
    const dispGrpCdOptions = [...new Set(complaints.map((complaint) => complaint.disp_grp_cd))];

    const handleFilter = () => {
        const filtered = complaints.filter((complaint) => {
            const matchesAging = filterAging ? complaint.mtr_aging.toString() === filterAging : true;
            const matchesDispGrpCd = filterDispGrpCd ? complaint.disp_grp_cd === filterDispGrpCd : true;
            return matchesAging && matchesDispGrpCd;
        });
        setFilteredComplaints(filtered);
    };

    return (
        <div>
            <h1>Supervisor Dashboard</h1>
            <Logout />

            {/* Filters Section */}
            <div className="filters">
                <select
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

                <select
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

                <button onClick={handleFilter}>Filter</button>
            </div>

            {/* Complaints Table */}
            <table className="table table-bordered table-dark">
                <thead>
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
                                <button onClick={() => handleEdit(complaint)}>Edit</button>
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

            {editingComplaint && (
                <EditComplaintForm complaint={editingComplaint} closeForm={closeEditForm} />
            )}
        </div>
    );
};

export default SupervisorDashboard;
