import React, { useState, useEffect } from 'react';
import { getClassrooms, engageClass, getCourses } from './api';

const Dashboard = ({ faculty }) => {
    const [date, setDate] = useState('');
    const [classrooms, setClassrooms] = useState([]);

    useEffect(() => {
        if (date) {
            getClassrooms(date).then(setClassrooms);
        }
    }, [date]);

    const handleEngage = (class_id, engage) => {
        engageClass(class_id, faculty.faculty_id, engage).then(() => {
            setClassrooms(prev =>
                prev.map(c => (c.class_id === class_id ? { ...c, engagement_flag: engage } : c))
            );
        });
    };

    return (
        <div>
            <h2>Welcome, {faculty.name}</h2>
            <input type="date" onChange={e => setDate(e.target.value)} />
            <ul>
                {classrooms.map(c => (
                    <li key={c.class_id}>
                        {c.class_name} - {c.room_number} - {c.engagement_flag ? 'Engaged' : 'Free'}
                        <button onClick={() => handleEngage(c.class_id, !c.engagement_flag)}>
                            {c.engagement_flag ? 'Disengage' : 'Engage'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
