const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to handle orders
app.post('/api/orders', (req, res) => {
    const { orders, phoneNumber, timestamp } = req.body;

    // Calculate total price
    const totalPrice = orders.reduce((total, item) => total + item.price * item.quantity, 0);

    const order = {
        phoneNumber, // Include phone number
        orders,
        totalPrice: totalPrice.toFixed(2),
        timestamp,
    };

    fs.readFile('orders.json', 'utf8', (err, data) => {
        let existingOrders = [];

        if (err && err.code === 'ENOENT') {
            console.warn('orders.json not found. Creating a new one.');
        } else if (data.trim() !== '') {
            try {
                existingOrders = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON file:', parseErr);
                return res.status(500).json({ error: 'Failed to parse orders file.' });
            }
        }

        existingOrders.push(order);

        fs.writeFile('orders.json', JSON.stringify(existingOrders, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Failed to write orders:', writeErr);
                return res.status(500).json({ error: 'Failed to save the order.' });
            }

            res.status(201).json({ message: 'Order saved successfully.', order });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
