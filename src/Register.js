import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const res = await axios.post('http://localhost:5000/register', { name, email, password, department });
            setMessage(res.data.message);
            setTimeout(() => navigate('/'), 2000); // Redirect to login after success
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">Faculty Registration</h2>
            <input type="text" placeholder="Name" className="border p-2 m-2 w-64" onChange={e => setName(e.target.value)} />
            <input type="email" placeholder="Email" className="border p-2 m-2 w-64" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="border p-2 m-2 w-64" onChange={e => setPassword(e.target.value)} />
            <input type="text" placeholder="Department" className="border p-2 m-2 w-64" onChange={e => setDepartment(e.target.value)} />
            <button onClick={handleRegister} className="bg-blue-500 text-white p-2 mt-4">Register</button>
            {message && <p className="text-red-500 mt-2">{message}</p>}
        </div>
    );
};

export default Register;
