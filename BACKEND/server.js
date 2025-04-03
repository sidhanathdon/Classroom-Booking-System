require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Faculty Login API
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM faculty WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

        const faculty = results[0];
        bcrypt.compare(password, faculty.password_hash, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error comparing passwords' });
            if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

            const token = jwt.sign({ faculty_id: faculty.faculty_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, faculty });
        });
    });
});

// Fetch Available Classrooms for a Date
app.get('/classrooms/:date', (req, res) => {
    const { date } = req.params;
    db.query(`
        SELECT c.*, s.faculty_id, f.name AS faculty_name, s.subject 
        FROM class c 
        LEFT JOIN schedule s ON c.class_id = s.class_id AND s.day = ?
        LEFT JOIN faculty f ON s.faculty_id = f.faculty_id
        WHERE c.floor = 1`, 
        [date], (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json(results);
        });
});
// Faculty Registration API
app.post('/register', async (req, res) => {
    const { name, email, password, department } = req.body;

    // Check if the email is already in use
    db.query('SELECT * FROM faculty WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new faculty record
        db.query(
            'INSERT INTO faculty (name, email, password_hash, department) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, department],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                res.json({ message: 'Faculty registered successfully' });
            }
        );
    });
});

// Engage/Disengage Class
app.post('/engage', (req, res) => {
    const { class_id, faculty_id, engage } = req.body;
    db.query('UPDATE class SET engagement_flag = ? WHERE class_id = ?', 
        [engage, class_id], (err) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json({ message: 'Class engagement updated' });
        }
    );
});

// Fetch Student Course Details
app.get('/courses/:class_id', (req, res) => {
    const { class_id } = req.params;
    db.query('SELECT * FROM student_course WHERE class_id = ?', [class_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
});

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
