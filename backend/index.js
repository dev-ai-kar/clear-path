const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001; // Using a different port than the Expo app

app.use(cors());
app.use(express.json());

// Database connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'form_submissions',
  password: 'mysecretpassword',
  port: 5432,
});

// API endpoint to handle form submissions
app.post('/api/submissions', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO submissions (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
