import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

const App = () => {
    const [faculty, setFaculty] = useState(null);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login setFaculty={setFaculty} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={faculty ? <Dashboard faculty={faculty} /> : <Login setFaculty={setFaculty} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
