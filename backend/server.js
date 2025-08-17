require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 

const app = express();
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

app.use(express.json());
app.use(cors()); 

const db = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

const jwtSecret = process.env.JWT_SECRET_KEY;

app.post('/signup', (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, role], (err, result) => {
        if (err) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(201).json({ message: 'User registered successfully!' });
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, {
            expiresIn: 86400 
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            role: user.role
        });
    });
});

app.get('/complaints', (req, res) => {
    const { username, status } = req.query;

    let query = `SELECT a.* FROM cms.complaints a, cms.user_dispatch_grp b 
                 WHERE a.disp_grp_cd = b.dispatch_grp_cd AND b.username = ?`;

    if (status) {
        query += ' AND a.cms_status = ?';
    }

    const params = status ? [username, status] : [username];
    db.query(query, params, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
});



app.get('/fitters', (req, res) => {
    const disp_grp_cd = req.query.disp_grp_cd; 
    console.log('Received disp_grp_cd:', disp_grp_cd);
    const query = 'SELECT * FROM fitters WHERE disp_grp_cd = ?';
    db.query(query, [disp_grp_cd], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
});

app.put('/complaints/:id', (req, res) => {
    console.log('Received payload:', req.body); 
    const complaintId = req.params.id;
    const { assigned_to, cms_status } = req.body;

    const query = 'UPDATE complaints SET assigned_to = ?, cms_status = ? WHERE fa_id = ?';
    db.query(query, [assigned_to, cms_status, complaintId], (err, result) => {
        if (err) {
            console.error('Error updating complaint:', err);
            return res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
        res.status(200).json({ message: 'Complaint updated successfully' });
    });
});
// Mark complaint as complete (Fitter action)
app.put('/complaints/complete/:fa_id', (req, res) => {
  const { fa_id } = req.params;

  const query = `
    UPDATE complaints 
    SET cms_status = 'complete', last_updated = NOW()
    WHERE fa_id = ?
  `;

  db.query(query, [fa_id], (err, result) => {
    if (err) {
      console.error("Error updating complaint to complete:", err);
      return res.status(500).send("Error updating complaint");
    }
    res.send({ message: "Complaint marked as complete" });
  });
});

app.get('/assignedComplaints', (req, res) => {
    const username = req.query.username;
    const query = 'select * from cms.complaints where assigned_to=?';
    db.query(query,[username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result); 
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
