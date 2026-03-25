
require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

app.get('/', (req, res) => {
    res.render('form', {
        error: null,
        values: {
            name: '',
            age: '',
            position: '',
            experience_level: '',
            notes: '',
        },
    });
});

app.post('/submit', async (req, res) => {
    const { name, age, position, experience_level, notes } = req.body;

    const safeValues = {
        name: name || '',
        age: age || '',
        position: position || '',
        experience_level: experience_level || '',
        notes: notes || '',
    };

    if (!name || !age || !position || !experience_level) {
        return res.status(400).render('form', {
            error: 'Please fill in name, age, position and experience level.',
            values: safeValues,
        });
    }

    const parsedAge = Number(age);

    if (!Number.isInteger(parsedAge) || parsedAge < 0) {
        return res.status(400).render('form', {
            error: 'Age must be a valid whole number.',
            values: safeValues,
        });
    }

    try {
        await pool.query(
            `
        INSERT INTO candidates (name, age, position, experience_level, notes)
        VALUES ($1, $2, $3, $4, $5)
      `,
            [
                name.trim(),
                parsedAge,
                position.trim(),
                experience_level.trim(),
                notes?.trim() || null,
            ]
        );

        res.render('success', { name: name.trim() });
    } catch (error) {
        console.error('Error saving candidate:', error);
        res.status(500).render('form', {
            error: 'Something went wrong while saving to the database.',
            values: safeValues,
        });
    }
});

app.get('/records', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT id, name, age, position, experience_level, notes, created_at FROM candidates ORDER BY created_at DESC'
        );

        res.render('records', { rows });
    } catch (error) {
        console.error('Error loading records:', error);
        res.status(500).send('Could not load records.');
    }
});

app.use((req, res) => {
    res.status(404).send(`404 - Page not found: ${req.originalUrl}`);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});