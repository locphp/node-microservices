const express = require('express');
const app = express();

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'product-service' });
});

app.get('/products', (req, res) => {
    res.json([
        { id: 101, name: 'Laptop' },
        { id: 102, name: 'Phone' }
    ]);
});

const PORT = 3000;
const server = app.listen(PORT, () => {
	console.log(`User service running on port ${PORT}`)
})

module.exports = { app, server }

