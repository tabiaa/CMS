import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const EditComplaintForm = ({ complaint, closeForm }) => {
    const [fitters, setFitters] = useState([]);
    const [selectedFitter, setSelectedFitter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFitters = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/fitters?disp_grp_cd=${complaint.disp_grp_cd}`);
                setFitters(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching fitters:', error);
                setError('Error fetching fitters');
                setLoading(false);
            }
        };

        fetchFitters();
    }, [complaint.disp_grp_cd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/complaints/${complaint.fa_id}`, {
                assigned_to: selectedFitter,
                cms_status: 'assign'
            });
            console.log('Complaint updated:', response.data);
            closeForm(); // Close the form
        } catch (error) {
            console.error('Error updating complaint:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Modal show onHide={closeForm}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Complaint</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="fitter">Assign to Fitter:</label>
                    <select
                        className='form-control form-control-sm'
                        id="fitter"
                        value={selectedFitter}
                        onChange={(e) => setSelectedFitter(e.target.value)}
                        required
                    >
                        <option value="">Select a fitter</option>
                        {fitters.map((fitter) => (
                            <option key={fitter.REP_CD} value={fitter.REP_CD}>
                                {fitter.REP_CD}
                            </option>
                        ))}
                    </select>
                    <Button type="submit" className='btn btn-danger mt-4'>Save</Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default EditComplaintForm;
