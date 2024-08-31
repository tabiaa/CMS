import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('supervisor');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/signup', { username, password, role });
            console.log(response.data); 
            alert(response.data.message);
        } catch (error) {
            console.error('Signup error:', error.response ? error.response.data : error.message);
            alert(error.response ? error.response.data.error : 'An unexpected error occurred');
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="supervisor">Supervisor</option>
                <option value="fitter">Fitter</option>
            </select>
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
