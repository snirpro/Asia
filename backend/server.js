const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'asia_project'
});

// Use CORS middleware (This will allow all CORS requests)
app.use(cors());

const promisePool = pool.promise();
//Login-Router//------------------------------------------------
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await promisePool.query('SELECT id, password, role FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Add isAdmin to the response to indicate admin status
        const isAdmin = user.role === 'admin';
        res.json({ message: 'Login successful', userId: user.id, isAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

app.post('/register', async (req, res) => {
    const { username, email, password, role = 'user' } = req.body;  // Default role is 'user'
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await promisePool.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, role]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

//Reviews-Router/---------------------------------------------------------------
app.post('/reviews', async (req, res) => {
    const { user_id, review, rating } = req.body;

    try {
        await promisePool.query(
            'INSERT INTO reviews (user_id, review, rating) VALUES (?, ?, ?)',
            [user_id, review, rating]
        );
        res.status(201).json({ message: 'Review posted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting review', error: error.message });
    }
});
app.get('/reviews', async (req, res) => {
    try {
        const [reviews] = await promisePool.query(
            'SELECT r.id, r.review, r.rating, r.created_at, u.username FROM reviews r JOIN users u ON r.user_id = u.id'
        );
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving reviews', error: error.message });
    }
});
app.delete('/reviews/:id', async (req, res) => {
    const { id } = req.params;
    // Here you should add logic to check if the user is an admin
    // For now, we assume the function isAdmin(userId) exists and returns true if the user is an admin

    try {
        await promisePool.query('DELETE FROM reviews WHERE id = ?', [id]);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
});

//Order-Router/------------------------------------------------------------------
app.post('/reservations', async (req, res) => {
    const { user_id, first_name, last_name, phone_number, id_number, number_of_guests, entry_date, exit_date, payment_type, credit_card_number, card_validity, cvv } = req.body;
    const base_price = 1500;
    const additional_guest_price = 150;
    // Calculate the total number of days
    const startDate = new Date(entry_date);
    const endDate = new Date(exit_date);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Ensure the total days are at least 1
    if (totalDays < 1) {
        return res.status(400).json({ message: 'Exit date must be after entry date' });
    }

    const amount_paid = (base_price + (number_of_guests - 2) * additional_guest_price)*totalDays;

    try {
        await promisePool.query('INSERT INTO reservations (user_id, first_name, last_name, phone_number, id_number, number_of_guests, entry_date, exit_date, amount_paid, payment_type, credit_card_number, card_validity, cvv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, first_name, last_name, phone_number, id_number, number_of_guests, entry_date, exit_date, amount_paid, payment_type, credit_card_number, card_validity, cvv]);
        res.status(201).json({ message: 'Reservation created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating reservation', error: error.message });
    }
});

app.get('/reservations', async (req, res) => {
    try {
        const [reservations] = await promisePool.query('SELECT * FROM reservations');
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving reservations', error: error.message });
    }
});
app.delete('/reservations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await promisePool.query('DELETE FROM reservations WHERE id = ?', [id]);
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting reservation', error: error.message });
    }
});

//Photos-Routers/------------------------------------------------------
app.post('/photos', async (req, res) => {
    let { Picture_classification, photo_url } = req.body;
    let path = photo_url;
    let parts = path.split('\\'); // Split the string on backslash
    let filename = parts[parts.length - 1]; // Get the last part of the array

    if (!Picture_classification || !photo_url) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    console.log(photo_url);
    try {
        await promisePool.query(
            `INSERT INTO photos (Picture_classification, photo_url) VALUES (?, ?)`,
            [Picture_classification, filename]


        );
        res.status(201).json({ message: 'Photo added successfully' });
    } catch (error) {
        console.error('Error adding photo:', error);
        res.status(500).json({ message: 'Error adding photo', error: error.message });
    }
});

app.get('/photos', async (req, res) => {
    try {
        const [photos] = await promisePool.query(`SELECT * FROM photos`);
        res.status(200).json(photos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching photos', error: error.message });
    }
});
app.delete('/photos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await promisePool.query(`DELETE FROM photos WHERE id = ?`, [id]);
        res.status(200).json({ message: 'Photo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting photo', error: error.message });
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
