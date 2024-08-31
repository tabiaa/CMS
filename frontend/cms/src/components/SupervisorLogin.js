import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ssgc from '../images/ssgc.jpg';

const SupervisorLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            const { token, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('username', username);

            navigate('/supervisor-dashboard');
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    return (
        <section
            className="vh"
            style={{
                backgroundImage: `url(${ssgc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-6">
                        <div
                            className="card"
                            style={{
                                borderRadius: '1rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                            }}
                        >
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-12 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-black">
                                        <form onSubmit={handleLogin}>
                                            <div className="d-flex align-items-center mb-3 pb-1">
                                                <i className="fas fa-cubes fa-2x me-3" style={{ color: '#ff6219' }}></i>
                                                <span className="h1 fw-bold mb-0">Complaint Management System</span>
                                            </div>
                                            <p>supervisor login
                                            <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>
                                                Log into your account
                                            </h5></p>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="text"
                                                    id="username"
                                                    className="form-control form-control-lg"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="Username"
                                                    required
                                                />
                                                <label className="form-label" htmlFor="username">Username</label>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="password"
                                                    className="form-control form-control-lg"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Password"
                                                    required
                                                />
                                                <label className="form-label" htmlFor="password">Password</label>
                                            </div>

                                            <div className="pt-1 mb-4">
                                                <button className="btn btn-dark btn-lg btn-block" type="submit">
                                                    Login
                                                </button>
                                            </div>

                                            <p className="small text-muted">Complaint Management System.</p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SupervisorLogin;
